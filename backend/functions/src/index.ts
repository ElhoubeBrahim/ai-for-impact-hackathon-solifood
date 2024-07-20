import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";

import * as express from "express";
import * as admin from "firebase-admin";
import * as cors from "cors";

import usersRoutes from "./routes/users";
import basketsRoutes from "./routes/baskets";
import { authorizeRequest } from "./helpers";

// Initialize the Firebase Admin SDK
admin.initializeApp({
	projectId: process.env.GCLOUD_PROJECT,
	credential: admin.credential.applicationDefault(),
});

// Create an Express app
const app = express();
app.use(express.json());
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

export const api = onRequest(app);
