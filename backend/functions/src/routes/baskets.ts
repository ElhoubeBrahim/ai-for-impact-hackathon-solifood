import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import * as Validator from "validatorjs";
import { Basket } from "../models/basket";

const router = express.Router();

// Get all baskets
router.get("/", async (req: Request, res: Response) => {
	const basketsSnapshot = await admin.firestore().collection("baskets").get();
	const baskets = basketsSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
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

	const basket = { id: basketDoc.id, ...basketDoc.data() };
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
