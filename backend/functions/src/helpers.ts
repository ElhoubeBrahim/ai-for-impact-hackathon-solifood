import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";
import { GeoPoint } from "firebase-admin/firestore";

export const authorizeRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if the request has an Authorization header
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer ")
	) {
		res.status(403).send("Unauthorized");
		return;
	}

	// Get the ID token from the Authorization header
	let idToken = req.headers.authorization.split("Bearer ")[1];

	// Extract user data from the ID token
	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		const userId = decodedIdToken.uid;

		// Get the user data from the Firestore database
		const user = await admin.firestore().collection("users").doc(userId).get();
		if (!user.exists) {
			res.status(403).send("Unauthorized");
			return;
		}

		// If user is blocked, return unauthorized
		if (user.data()?.blocked) {
			res.status(403).send("Unauthorized");
			return;
		}

		// @ts-ignore
		req.user = user.data();
		next();
		return;
	} catch (error) {
		res.status(403).send("Unauthorized");
		return;
	}
};

export const authorizeSuperAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// @ts-ignore
	const user = req.user;
	if (!user || user.isSuperAdmin === undefined || user.isSuperAdmin !== true) {
		res.status(403).send("Unauthorized");
		return;
	}

	next();
};

// Helper function to calculate the bounding box
export const getBoundingBox = (center: GeoPoint, radiusInKm: number) => {
	const lat = center.latitude;
	const lon = center.longitude;
	const R = 6371; // Earth's radius in km

	const latChange = radiusInKm / R;
	const lonChange =
		(Math.asin(Math.sin(radiusInKm / R) / Math.cos((lat * Math.PI) / 180)) *
			180) /
		Math.PI;

	return {
		min: {
			latitude: lat - (latChange * 180) / Math.PI,
			longitude: lon - lonChange,
		},
		max: {
			latitude: lat + (latChange * 180) / Math.PI,
			longitude: lon + lonChange,
		},
	};
};

// Helper function to calculate distance between two points
export const calculateDistance = (point1: GeoPoint, point2: GeoPoint) => {
	const R = 6371; // Earth's radius in km
	const lat1 = (point1.latitude * Math.PI) / 180;
	const lat2 = (point2.latitude * Math.PI) / 180;
	const lon1 = (point1.longitude * Math.PI) / 180;
	const lon2 = (point2.longitude * Math.PI) / 180;

	const dLat = lat2 - lat1;
	const dLon = lon2 - lon1;

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // Distance in km
};
