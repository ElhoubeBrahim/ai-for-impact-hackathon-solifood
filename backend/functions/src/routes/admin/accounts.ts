import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import { User } from "../../models/user";

const router = express.Router();

// Get all users + pagination using lastDoc
router.get("/", async (req: Request, res: Response) => {
	try {
		const limit = parseInt(req.query.limit as string) || 10;
		const lastDoc = req.query.lastDoc as string;
		const search = req.query.search as string;

		const baseQuery = admin
			.firestore()
			.collection("users")
			.orderBy("joinedAt", "desc")
			.where("isSuperAdmin", "==", false)
			.limit(limit);

		let fieldQueries = [];

		if (search) {
			const end = search.replace(/.$/, (c) =>
				String.fromCharCode(c.charCodeAt(0) + 1)
			);
			fieldQueries = ["firstName", "lastName", "email"].map((field) =>
				baseQuery.where(field, ">=", search).where(field, "<", end)
			);
		} else {
			fieldQueries = [baseQuery];
		}

		if (lastDoc) {
			const lastDocSnapshot = await admin
				.firestore()
				.collection("users")
				.doc(lastDoc)
				.get();
			if (!lastDocSnapshot.exists) {
				return res.status(404).json({ error: "Last document not found" });
			}
			fieldQueries.forEach((query, index) => {
				fieldQueries[index] = query.startAfter(lastDocSnapshot);
			});
		}

		const snapshots = await Promise.all(
			fieldQueries.map((query) => query.get())
		);
		const users = snapshots.flatMap((snapshot) =>
			snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User))
		);

		const uniqueUsers = Array.from(new Set(users.map((user) => user.id))).map(
			(id) => users.find((user) => user.id === id)
		);

		return res.status(200).json(uniqueUsers);
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch users" });
	}
});

// Get user by id
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const userDoc = await admin
			.firestore()
			.collection("users")
			.doc(req.params.id)
			.get();

		if (!userDoc.exists || (userDoc.data() as User).isSuperAdmin) {
			return res.status(404).json({ error: "User not found" });
		}

		const user = { id: userDoc.id, ...userDoc.data() } as User;
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch user" });
	}
});

// Block user by id
router.put("/:id/block", async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;

		// Fetch the existing user data
		const existingUserDoc = await admin
			.firestore()
			.collection("users")
			.doc(userId)
			.get();
		if (
			!existingUserDoc.exists ||
			(existingUserDoc.data() as User).isSuperAdmin
		) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update the user data
		await admin.firestore().collection("users").doc(userId).update({
			blocked: true,
		});

		return res.status(200).json({ message: "User blocked successfully" });
	} catch (error) {
		return res.status(500).json({ error: "Failed to block user" });
	}
});

export default router;
