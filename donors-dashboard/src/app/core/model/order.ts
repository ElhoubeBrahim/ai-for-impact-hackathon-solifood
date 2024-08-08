import { Basket } from './basket';
import { User } from './user';

export interface Order {
  id: string;
  basket: Basket;
  orderBy: User;
  message: string;
  status: OrderStatus;
  orderedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}
