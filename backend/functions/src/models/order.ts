import { Timestamp } from "firebase-admin/firestore";
import { Basket } from "./basket";
import { User } from "./user";

export interface Order {
	id: string;
	basket: Basket;
	orderBy: User;
	message: string;
	status: OrderStatus;
	orderedAt: Timestamp;
}

export enum OrderStatus {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	REJECTED = "REJECTED",
	CANCELED = "CANCELED",
	COMPLETED = "COMPLETED",
}
