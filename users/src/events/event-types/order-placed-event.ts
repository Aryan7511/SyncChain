import { Subjects } from '../subjects';

export interface OrderPlacedEvent {
  subject: Subjects.OrderPlaced;
  data: {
    orderId: string;
    userId: string;
    productId: string;
    productName: string;
    totalAmount: number;
    quantity: number;
    status: string;
    createdAt: string
  };
}
