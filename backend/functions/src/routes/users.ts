import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import { authorizeRequest } from "../helpers";
import * as Validator from "validatorjs";
import { uuid } from "uuidv4";

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
	await admin
		.firestore()
		.collection("users")
		.doc(userData.id)
		.set({ ...userData, isSuperAdmin: false });
	return res.json({ message: "User saved successfully" });
});

router.post("/avatar", authorizeRequest, async (req: Request, res: Response) => {
	const storage = admin.storage().bucket();
	const file = req.files && req.files[0]; // Get the first file

	if (!file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	// Check if the file is an image
	if (!file.mimetype.startsWith("image/")) {
		return res.status(400).json({ error: "Uploaded file is not an image" });
	}

	// Prepare the file name and reference
	const fileName = `avatars/${uuid()}-${file.originalname}`;
	const fileRef = storage.file(fileName);

	try {
		// Save the file to Firebase Storage
		await fileRef.save(file.buffer, {
			metadata: {
				contentType: file.mimetype,
			},
		});

		// Get the public URL of the uploaded file
		const url = fileRef.publicUrl();

		// Return the URL of the uploaded avatar
		return res.status(200).json({
			message: "Avatar uploaded successfully",
			url,
		});
	} catch (error) {
		console.error("Error uploading avatar:", error);
		return res.status(500).json({ error: "Failed to upload avatar" });
	}
});

router.put("/", authorizeRequest, async (req: Request, res: Response) => {
	// @ts-ignore
	const user = req.user;
	const updateData = req.body;

	console.log(user);

	const rules = {
		firstName: ["string"],
		lastName: ["string"],
		picture: ["string"],
	};

	const validation = new Validator(updateData, rules);
	if (validation.fails()) {
		return res.status(400).json({
			errors: validation.errors.all(),
		});
	}

	try {
		const db = admin.firestore();
		const userRef = db.collection("users").doc(user.id);

		// Update user data
		await userRef.update({
			firstName: updateData.firstName,
			lastName: updateData.lastName,
			picture: updateData.picture,
		});

		return res.status(200).json({
			message: "User updated successfully",
		});
	} catch (error) {
		console.log("Error updating user:", error);
		return res.status(500).json({ error: "Failed to update user" });
	}
});

export default router;
