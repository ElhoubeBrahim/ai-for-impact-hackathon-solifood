import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

import * as express from "express";
import * as admin from "firebase-admin";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as fileParser from "express-multipart-file-parser";

import usersRoutes from "./routes/users";
import basketsRoutes from "./routes/baskets";
import accountsRoutes from "./routes/admin/accounts";
import reportsRoutes from "./routes/admin/reports";
import { authorizeRequest, authorizeSuperAdmin } from "./helpers";
import { Basket } from "./models/basket";

// Initialize the Firebase Admin SDK
admin.initializeApp({
	projectId: process.env.GCLOUD_PROJECT,
	credential: admin.credential.applicationDefault(),
	storageBucket: "ai-for-impact-solifood-ca41a.appspot.com",
});

// Create an Express app
const app = express();
app.use(fileParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.json({
		message: "Welcome to the SoliFood API",
		version: "1.0.0",
		description: "A RESTful API for the SoliFood plarform",
		url: "https://solifood.com",
	});
});

app.use("/profile", usersRoutes);
app.use("/baskets", authorizeRequest, basketsRoutes);

app.use("/accounts", authorizeRequest, authorizeSuperAdmin, accountsRoutes);
app.use("/reports", authorizeRequest, authorizeSuperAdmin, reportsRoutes);

export const api = onRequest(app);

export const createBasket = onDocumentCreated("baskets/{basketId}", (event) => {
	if (!event.data) {
		return;
	}

	// Get only the needed fields
	const basket = event.data.data() as Basket;
	const data = {
		id: event.params.basketId,
		available: basket.available,
		blocked: basket.blocked,
		expiredAt: basket.expiredAt.seconds,
		createdAt: basket.createdAt.seconds,
		location: basket.location,
		title: basket.title,
		description: basket.description,
		ingredients: basket.ingredients,
		tags: basket.tags,
	};

	// Send the basket data to the search API
	fetch(process.env.SEARCH_API + "/add-baskets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			baskets: [data],
		}),
	});
});
