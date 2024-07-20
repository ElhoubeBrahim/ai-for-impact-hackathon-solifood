import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import * as Validator from "validatorjs";
import { Basket } from "../models/basket";
import { User } from "../models/user";
import { uuid } from "uuidv4";
import { Timestamp } from "firebase-admin/firestore";

const router = express.Router();

// Get all baskets
router.get("/", async (req: Request, res: Response) => {
	const pageSize = 12; // Number of items per page
	const lastDocId = req.query.lastDocId as string | undefined; // ID of the last document from the previous page

	let query = admin
		.firestore()
		.collection("baskets")
		.where("available", "==", true)
		.where("soldAt", "==", null)
		.orderBy("createdAt", "desc")
		.limit(pageSize);

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

	const basketsSnapshot = await query.get();

	const baskets = basketsSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
		expiredAt: doc.data().expiredAt.toDate(),
		createdAt: doc.data().createdAt.toDate(),
	}));

	res.json(baskets);
});

// Get a specific basket by ID
router.get("/:id", async (req: Request, res: Response) => {
	const basketDoc = await admin
		.firestore()
		.collection("baskets")
		.doc(req.params.id)
		.get();

	if (!basketDoc.exists) {
		return res.status(404).json({ error: "Basket not found" });
	}

	const data = basketDoc.data() as Basket;
	const basket = {
		...data,
		expiredAt: data.expiredAt.toDate(),
		createdAt: data.createdAt.toDate(),
	};
	return res.json(basket);
});

// Create a new basket
router.post("/", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	// Validate basket data
	const newBasket: Basket = req.body;
	const { valid, errors } = validateData(newBasket);
	if (!valid) {
		return res.status(400).json({ errors });
	}

	// Add user to the basket
	newBasket.createdBy = user;
	newBasket.createdAt = Timestamp.now();

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
	const updatedBasket: Partial<Basket> = req.body;
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
		expiredAt: ["required"],
		"expiredAt.nanoseconds": ["required", "numeric"],
		"expiredAt.seconds": ["required", "numeric"],
	};

	const validation = new Validator(data, rules);
	return {
		valid: validation.passes(),
		errors: validation.errors.all(),
	};
}
