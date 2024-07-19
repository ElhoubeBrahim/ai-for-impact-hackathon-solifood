import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import { authorizeRequest } from "../helpers";
import * as Validator from "validatorjs";

const router = express.Router();

router.get("/", authorizeRequest, (req: Request, res: Response) => {
	// @ts-ignore
	const user = req.user;
	return res.json(user);
});

router.post("/save", async (req: Request, res: Response) => {
	// Get data
	const userData = req.body;

	// Validate user data
	const rules = {
		id: ["required", "string"],
		firstName: ["required", "string"],
		lastName: ["required", "string"],
		picture: ["required", "string"],
		email: ["required", "string"],
		location: ["required"],
		"location.lat": ["required", "numeric"],
		"location.lon": ["required", "numeric"],
		blocked: ["required", "boolean"],
		lastLogin: ["required"],
		"lastLogin.nanoseconds": ["required", "numeric"],
		"lastLogin.seconds": ["required", "numeric"],
		joinedAt: ["required"],
		"joinedAt.nanoseconds": ["required", "numeric"],
		"joinedAt.seconds": ["required", "numeric"],
	};

	const validation = new Validator(userData, rules);
	if (validation.fails()) {
		return res.status(400).json({
			errors: validation.errors.all(),
		});
	}

	// Check if user already exists
	const userDoc = await admin
		.firestore()
		.collection("users")
		.doc(userData.id)
		.get();
	if (userDoc.exists) {
		return res.json({ message: "User already exists" });
	}

	// Save user
	await admin.firestore().collection("users").doc(userData.id).set(userData);
	return res.json({ message: "User saved successfully" });
});

export default router;
