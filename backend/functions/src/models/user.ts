import { Timestamp } from "firebase-admin/firestore";

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	picture: string;
	email: string;
	location: { lat: number; lon: number };
	ratings: { rating: number; by: string }[];
	blocked: boolean;
	isSuperAdmin: boolean;
	lastLogin: Timestamp;
	joinedAt: Timestamp;
}
