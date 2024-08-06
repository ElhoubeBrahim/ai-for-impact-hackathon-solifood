import { Timestamp } from '@angular/fire/firestore';
import { User } from './user';

export interface Basket {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: { lat: number; lon: number };
  available: boolean;
  blocked: boolean;
  tags: string[];
  ingredients: string[];
  createdBy: User;
  claimedBy: User | null;
  expiredAt: Timestamp;
  soldAt: Timestamp | null;
  createdAt: Timestamp;
}
