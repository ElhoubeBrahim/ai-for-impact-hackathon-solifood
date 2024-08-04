import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";

const router = express.Router();

// Get all reports + pagination using lastDoc + filter by user or basket + order by date
router.get("/", async (req: Request, res: Response) => {
	try {
		const pageSize = parseInt(req.query.pageSize as string) || 10;
		const lastDocId = req.query.lastDocId as string | undefined;
		const userId = req.query.userId as string | undefined;
		const basketId = req.query.basketId as string | undefined;

		let query = admin
			.firestore()
			.collection("reports")
			.orderBy("createdAt", "desc");

		// Apply filters
		if (userId) {
			query = query.where("reportedBy.id", "==", userId);
		}
		if (basketId) {
			query = query.where("basket.id", "==", basketId);
		}

		// Apply pagination
		if (lastDocId) {
			const lastDoc = await admin
				.firestore()
				.collection("reports")
				.doc(lastDocId)
				.get();
			if (lastDoc.exists) {
				query = query.startAfter(lastDoc);
			}
		}

		query = query.limit(pageSize);

		const snapshot = await query.get();
		const reports = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			createdAt: doc.data().createdAt.toDate(),
		}));

		return res.status(200).json(reports);
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while fetching reports" });
	}
});

// Get report by id
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const reportDoc = await admin
			.firestore()
			.collection("reports")
			.doc(req.params.id)
			.get();

		if (!reportDoc.exists) {
			return res.status(404).json({ error: "Report not found" });
		}

		const reportData = reportDoc.data();
		const report = {
			id: reportDoc.id,
			...reportData,
			createdAt: reportData?.createdAt.toDate(),
		};

		return res.status(200).json(report);
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while fetching the report" });
	}
});

// Delete report by id
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const reportRef = admin
			.firestore()
			.collection("reports")
			.doc(req.params.id);
		const reportDoc = await reportRef.get();

		if (!reportDoc.exists) {
			return res.status(404).json({ error: "Report not found" });
		}

		await reportRef.delete();

		return res.status(200).json({ message: "Report deleted successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while deleting the report" });
	}
});

export default router;
