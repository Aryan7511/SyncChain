import { Subjects } from '../subjects';

export interface OrderShippedEvent {
  subject: Subjects.OrderShipped;
  data: {
    orderId: string;
    userId: string;
    status: string;
  };
}
