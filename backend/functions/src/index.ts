import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";

import * as express from "express";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK
admin.initializeApp({
	projectId: process.env.GCLOUD_PROJECT,
	credential: admin.credential.applicationDefault(),
});

// Create an Express app
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({
		message: "Welcome to the SoliFood API",
		version: "1.0.0",
		description: "A RESTful API for the SoliFood plarform",
		url: "https://solifood.com",
	});
});

export const api = onRequest(app);
