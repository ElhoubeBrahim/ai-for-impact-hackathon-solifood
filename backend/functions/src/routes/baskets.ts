import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import * as Validator from "validatorjs";
import { Basket } from "../models/basket";
import { User } from "../models/user";
import { uuid } from "uuidv4";
import {
	DocumentData,
	GeoPoint,
	Query,
	Timestamp,
} from "firebase-admin/firestore";
import {
	authorizeSuperAdmin,
	calculateDistance,
	getBoundingBox,
} from "../helpers";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	const pageSize = 12; // Number of items per page
	const lastDocId = req.query.lastDocId as string | undefined;

	// Get filters from query parameters
	const latitude = req.query.latitude as string;
	const longitude = req.query.longitude as string;
	const range = req.query.range as string;
	const sortBy = (req.query.sortBy as string) || "newest";
	const tags = ((req.query.tags as string) || "").split(",").filter(Boolean);

	// Check if the user is a super admin
	const isSuperAdmin = user.isSuperAdmin === true;

	let query: Query<DocumentData> = admin.firestore().collection("baskets");

	// Apply availability filters only if not a super admin
	if (!isSuperAdmin) {
		query = query
			.where("available", "==", true)
			.where("soldAt", "==", null)
			.where("blocked", "==", false); // Add this line
	}

	// Rest of the query building remains the same
	if (tags.length > 0) {
		query = query.where("tags", "array-contains-any", tags);
	}

	if (latitude && longitude && range) {
		// Validate location parameters
		const lat = parseFloat(latitude);
		const lon = parseFloat(longitude);
		const rangeInMeters = parseFloat(range);
		const useLocationFilter =
			!isNaN(lat) && !isNaN(lon) && !isNaN(rangeInMeters);

		// Calculate the bounding box for the query
		const center = new GeoPoint(lat, lon);
		const radiusInKm = rangeInMeters / 1000;
		const bounds = getBoundingBox(center, radiusInKm);

		// Get nearby baskets only
		if (useLocationFilter) {
			query = query
				.where("location.lat", ">=", bounds.min.latitude)
				.where("location.lat", "<=", bounds.max.latitude)
				.where("location.lon", ">=", bounds.min.longitude)
				.where("location.lon", "<=", bounds.max.longitude);
		}
	}

	// Apply sorting
	switch (sortBy) {
		case "newest":
			query = query.orderBy("createdAt", "desc");
			break;
		case "oldest":
			query = query.orderBy("price", "asc");
			break;
		case "high-rating":
			// TODO: Implement sorting by rating
			break;
		case "low-rating":
			// TODO: Implement sorting by rating
			break;
		default:
			query = query.orderBy("createdAt", "desc");
			break;
	}

	query = query.limit(pageSize);

	// If lastDocId is provided, use it for pagination
	if (lastDocId) {
		const lastDoc = await admin
			.firestore()
			.collection("baskets")
			.doc(lastDocId)
			.get();

		if (lastDoc.exists) {
			query = query.startAfter(lastDoc);
		}
	}

	const snapshot = await query.get();
	let baskets = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
		expiredAt: doc.data().expiredAt.toDate(),
		createdAt: doc.data().createdAt.toDate(),
	}));

	return res.json(baskets);
});

// Get close baskets
router.get("/nearby", async (req: Request, res: Response) => {
	const { latitude, longitude, range } = req.query;

	// Validate input parameters
	if (!latitude || !longitude || !range) {
		return res.status(400).json({
			error: "Missing required parameters: latitude, longitude, or range",
		});
	}

	const lat = parseFloat(latitude as string);
	const lon = parseFloat(longitude as string);
	const rangeInMeters = parseFloat(range as string);

	if (isNaN(lat) || isNaN(lon) || isNaN(rangeInMeters)) {
		return res.status(400).json({ error: "Invalid parameter values" });
	}

	const center = new GeoPoint(lat, lon);
	const radiusInKm = rangeInMeters / 1000;

	// Calculate the bounding box for the query
	const bounds = getBoundingBox(center, radiusInKm);

	// Get nearby baskets from Firestore
	const query = admin
		.firestore()
		.collection("baskets")
		.where("available", "==", true)
		.where("soldAt", "==", null)
		.where("blocked", "==", false)
		.where("location.lat", ">=", bounds.min.latitude)
		.where("location.lat", "<=", bounds.max.latitude)
		.where("location.lon", ">=", bounds.min.longitude)
		.where("location.lon", "<=", bounds.max.longitude);

	const snapshot = await query.get();
	const nearbyBaskets: Basket[] = [];
	snapshot.forEach((doc) => {
		const basket = doc.data() as Basket;
		const distance = calculateDistance(
			center,
			new GeoPoint(basket.location.lat, basket.location.lon)
		);
		if (distance <= radiusInKm) {
			nearbyBaskets.push({
				...basket,
				id: doc.id,
			});
		}
	});

	return res.json(nearbyBaskets);
});

// Search baskets
router.get("/search", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const isSuperAdmin = user.isSuperAdmin === true;

	// Get query parameters
	const query = req.query.q as string;

	// Get baskets IDs from the search API
	const response = await fetch(
		`${process.env.SEARCH_API}/search?query=${query}`
	);
	const data = await response.json();

	// If no baskets found, return an empty array
	if (!data.ids || data.ids.length === 0) {
		return res.json([]);
	}

	// Get baskets from Firestore
	const baskets = await admin
		.firestore()
		.getAll(
			...data.ids.map((id: string) =>
				admin.firestore().collection("baskets").doc(id)
			)
		);

	// Format the baskets data
	const results = baskets.map((doc) => {
		const data = doc.data() as Basket;
		return {
			...data,
			expiredAt: data.expiredAt.toDate(),
			createdAt: data.createdAt.toDate(),
		};
	});

	return res.json(
		isSuperAdmin
			? results
			: results.filter(
					(basket) => basket.available && !basket.soldAt && !basket.blocked
			  )
	);
});

// Get a specific basket by ID
router.get("/:id", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const isSuperAdmin = user.isSuperAdmin;

	const basketDoc = await admin
		.firestore()
		.collection("baskets")
		.doc(req.params.id)
		.get();

	if (!basketDoc.exists) {
		return res.status(404).json({ error: "Basket not found" });
	}

	const data = basketDoc.data() as Basket;

	// If the user is not a super admin, check if the basket is available
	if (!isSuperAdmin && (!data.available || data.soldAt || data.blocked)) {
		return res.status(404).json({ error: "Basket not found" });
	}

	const basket = {
		...data,
		expiredAt: data.expiredAt.toDate(),
		createdAt: data.createdAt.toDate(),
	};
	return res.json(basket);
});

// Get baskets for a specific user
router.get("/user/:id", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const isSuperAdmin = user.isSuperAdmin === true;

	let query = await admin
		.firestore()
		.collection("baskets")
		.orderBy("createdAt", "desc")
		.where("createdBy.id", "==", req.params.id);

	if (!isSuperAdmin) {
		query = query
			.where("blocked", "==", false)
			.where("available", "==", true)
			.where("soldAt", "==", null);
	}

	let basketsSnapshot = await query.get();

	const baskets = basketsSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
		expiredAt: doc.data().expiredAt.toDate(),
		createdAt: doc.data().createdAt.toDate(),
	}));

	res.json(baskets);
});

// Create a new basket
router.post("/", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	// Validate basket data
	const newBasket = req.body;
	const { valid, errors } = validateData(newBasket);
	if (!valid) {
		return res.status(400).json({ errors });
	}

	// Add user to the basket
	newBasket.createdBy = user;
	newBasket.createdAt = Timestamp.now();
	newBasket.expiredAt = Timestamp.fromMillis(newBasket.expiredAt * 1000);

	// Create the basket
	const docRef = await admin.firestore().collection("baskets").add(newBasket);
	const doc = await docRef.get();
	return res.status(201).json({ id: doc.id, ...doc.data() });
});

// Update a basket
router.put("/:id", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	// Validate basket data
	const updatedBasket = req.body;
	const { valid, errors } = validateData(updatedBasket as Basket);
	if (!valid) {
		return res.status(400).json({ errors });
	}

	// Check if the basket exists and was created by the current user
	const basketDoc = await admin
		.firestore()
		.collection("baskets")
		.doc(req.params.id)
		.get();
	if (
		!basketDoc.exists ||
		(basketDoc.data() as Basket).createdBy.id !== user.id
	) {
		return res.status(404).json({ error: "Basket not found" });
	}

	updatedBasket.expiredAt = Timestamp.fromMillis(
		updatedBasket.expiredAt * 1000
	);

	// Update basket
	await admin
		.firestore()
		.collection("baskets")
		.doc(req.params.id)
		.update(updatedBasket);
	return res.status(200).json({ id: req.params.id, ...updatedBasket });
});

// Delete a basket
router.delete("/:id", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	// Check if the basket exists and was created by the current user
	const basketDoc = await admin
		.firestore()
		.collection("baskets")
		.doc(req.params.id)
		.get();
	if (
		!basketDoc.exists ||
		(basketDoc.data() as Basket).createdBy.id !== user.id
	) {
		return res.status(404).json({ error: "Basket not found" });
	}

	// Delete the basket
	await admin.firestore().collection("baskets").doc(req.params.id).delete();
	return res.status(200).json({ message: "Basket deleted successfully" });
});

// Upload basket images
router.post("/images", async (req: Request, res: Response) => {
	const storage = admin.storage().bucket();
	const files = req.files;

	if (!files || !files.length) {
		return res.status(400).json({ error: "No files uploaded" });
	}

	const uploadedImages: string[] = [];

	// Upload images to Firebase Storage
	for (const file of files) {
		// Prepare the file name and reference
		const fileName = `baskets/${uuid()}-${file.originalname}`;
		const fileRef = storage.file(fileName);

		// Save the file to Firebase Storage
		await fileRef.save(file.buffer, {
			metadata: {
				contentType: file.mimetype,
			},
		});

		// Get the public URL of the uploaded file
		const url = fileRef.publicUrl();
		uploadedImages.push(url);
	}

	// Return the URLs of the uploaded images
	return res
		.status(200)
		.json({ message: "Images uploaded successfully", uploadedImages });
});

// Report a basket
router.post("/report/:id", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	// Get report data from the request body
	const { reason, details } = req.body;
	if (!reason || !reason.length || !details) {
		return res.status(400).json({ error: "Missing required parameters" });
	}

	// Check if the basket exists and was not created by the current user
	const basketDoc = await admin
		.firestore()
		.collection("baskets")
		.doc(req.params.id)
		.get();
	if (
		!basketDoc.exists ||
		(basketDoc.data() as Basket).createdBy.id === user.id
	) {
		return res.status(404).json({ error: "Basket not found" });
	}

	// Prepare the report data
	const report = {
		basket: basketDoc.data(),
		reportedBy: user,
		reason: reason.join(", "),
		details,
		createdAt: Timestamp.now(),
	};

	// Save the report to Firestore
	await admin.firestore().collection("reports").add(report);
	return res.status(201).json(report);
});

// Toggle block status of a basket
router.post(
	"/block/:id",
	authorizeSuperAdmin,
	async (req: Request, res: Response) => {
		// @ts-ignore
		const user: User = req.user;

		try {
			const basketId = req.params.id;

			// Check if the basket exists
			const basketRef = admin.firestore().collection("baskets").doc(basketId);
			const basketDoc = await basketRef.get();

			if (!basketDoc.exists) {
				return res.status(404).json({ error: "Basket not found" });
			}

			// Get the current basket data
			const basketData = basketDoc.data() as Basket;

			// Toggle the blocked status
			const newBlockedStatus = !basketData.blocked;

			// Update the basket to set the new blocked status
			await basketRef.update({
				blocked: newBlockedStatus,
			});

			// Prepare the response message
			const actionTaken = newBlockedStatus ? "blocked" : "unblocked";

			return res.status(200).json({
				message: `Basket ${actionTaken} successfully`,
				blocked: newBlockedStatus,
			});
		} catch (error) {
			return res.status(500).json({
				error: "An error occurred while updating the basket's block status",
			});
		}
	}
);

export default router;

function validateData(data: Basket) {
	const rules = {
		title: ["required", "string"],
		description: ["required", "string"],
		images: ["required", "array"],
		location: ["required"],
		"location.lat": ["required", "numeric"],
		"location.lon": ["required", "numeric"],
		available: ["required", "boolean"],
		tags: ["array"],
		ingredients: ["array"],
		expiredAt: ["required", "numeric"],
	};

	const validation = new Validator(data, rules);
	return {
		valid: validation.passes(),
		errors: validation.errors.all(),
	};
}
