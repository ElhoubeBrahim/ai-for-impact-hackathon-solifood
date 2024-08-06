import { Request, Response } from "express";
import * as express from "express";
import * as admin from "firebase-admin";
import { Order, OrderStatus } from "../models/order";
import { DocumentData, Query, Timestamp } from "firebase-admin/firestore";
import { Basket } from "../models/basket";

const router = express.Router();

// Get all orders
router.get("/", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const isSuperAdmin = user.isSuperAdmin === true;

	const pageSize = 12; // Number of items per page
	const lastDocId = req.query.lastDocId as string | undefined;
	const status = req.query.status as OrderStatus | undefined;

	let query: Query<DocumentData> = admin.firestore().collection("orders");

	// Apply filters
	if (!isSuperAdmin) {
		query = query.where("orderBy.id", "==", user.id);
	}

	if (status) {
		query = query.where("status", "==", status);
	}

	query = query.orderBy("orderedAt", "desc").limit(pageSize);

	// If lastDocId is provided, use it for pagination
	if (lastDocId) {
		const lastDoc = await admin
			.firestore()
			.collection("orders")
			.doc(lastDocId)
			.get();
		if (lastDoc.exists) {
			query = query.startAfter(lastDoc);
		}
	}

	const snapshot = await query.get();
	const orders = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
		orderedAt: doc.data().orderedAt.toDate(),
	}));

	return res.json(orders);
});

// Get orders for donor's baskets
router.get("/seller", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const basketId = req.query.basketId as string | undefined;
	const status = req.query.status as OrderStatus | undefined;
	const pageSize = 12; // Number of items per page
	const lastDocId = req.query.lastDocId as string | undefined;

	let query: Query<DocumentData> = admin.firestore().collection("orders");

	// Filter orders for baskets created by the user
	query = query.where("basket.createdBy.id", "==", user.id);

	// Apply basket filter if provided
	if (basketId) {
		query = query.where("basket.id", "==", basketId);
	}

	// Apply status filter if provided
	if (status) {
		query = query.where("status", "==", status);
	}

	query = query.orderBy("orderedAt", "desc").limit(pageSize);

	// If lastDocId is provided, use it for pagination
	if (lastDocId) {
		const lastDoc = await admin
			.firestore()
			.collection("orders")
			.doc(lastDocId)
			.get();
		if (lastDoc.exists) {
			query = query.startAfter(lastDoc);
		}
	}

	const snapshot = await query.get();
	const orders = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
		orderedAt: doc.data().orderedAt.toDate(),
	}));

	return res.json(orders);
});

// Get a specific order by ID
router.get("/:id", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const isSuperAdmin = user.isSuperAdmin === true;

	const orderDoc = await admin
		.firestore()
		.collection("orders")
		.doc(req.params.id)
		.get();

	if (!orderDoc.exists) {
		return res.status(404).json({ error: "Order not found" });
	}

	const orderData = orderDoc.data() as Order;

	// Check if the user has permission to view this order
	if (
		!isSuperAdmin &&
		orderData.orderBy.id !== user.id &&
		orderData.basket.createdBy.id !== user.id
	) {
		return res.status(403).json({ error: "Access denied" });
	}

	const order = {
		...orderData,
		orderedAt: orderData.orderedAt.toDate(),
	};

	return res.json(order);
});

// Create a new order
router.post("/", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;

	const { basketId, message } = req.body;

	// Validate order data
	if (!basketId || !message) {
		return res.status(400).json({
			error: "Invalid order data. basketId and message are required.",
		});
	}

	// Fetch the basket
	const basketDoc = await admin
		.firestore()
		.collection("baskets")
		.doc(basketId)
		.get();

	if (!basketDoc.exists) {
		return res.status(404).json({ error: "Basket not found" });
	}

	const basketData = basketDoc.data() as Basket;

	// Check if the basket is available for ordering
	if (!basketData.available || basketData.soldAt || basketData.blocked) {
		return res
			.status(400)
			.json({ error: "This basket is not available for ordering" });
	}

	// Check if the user is the creator of the basket
	if (basketData.createdBy.id === user.id) {
		return res.status(403).json({ error: "You cannot order your own basket" });
	}

	const newOrder: Partial<Order> = {
		basket: basketData,
		message,
		orderBy: user,
		status: OrderStatus.PENDING,
		orderedAt: Timestamp.now(),
	};

	// Create the order
	const docRef = await admin.firestore().collection("orders").add(newOrder);
	const doc = await docRef.get();

	return res.status(201).json({ id: doc.id, ...doc.data() });
});

// Update order status
router.put("/:id/status", async (req: Request, res: Response) => {
	// @ts-ignore
	const user: User = req.user;
	const orderId = req.params.id;
	const newStatus = req.body.status as OrderStatus;

	if (!Object.values(OrderStatus).includes(newStatus)) {
		return res.status(400).json({ error: "Invalid status" });
	}

	const orderRef = admin.firestore().collection("orders").doc(orderId);
	const orderDoc = await orderRef.get();

	if (!orderDoc.exists) {
		return res.status(404).json({ error: "Order not found" });
	}

	const orderData = orderDoc.data() as Order;

	// Check permissions and allowed status changes
	if (
		user.isSuperAdmin ||
		(orderData.basket.createdBy.id === user.id &&
			newStatus !== OrderStatus.CANCELED) ||
		(orderData.orderBy.id === user.id && newStatus === OrderStatus.CANCELED)
	) {
		// Update the order status
		await orderRef.update({ status: newStatus });
		return res.json({ id: orderId, status: newStatus });
	} else {
		return res.status(403).json({ error: "Access denied" });
	}
});

export default router;
