import { Subjects } from '../subjects';

export interface ProductUpdatedEvent {
  subject: Subjects.InventoryUpdated;
  data: {
    productId: string;
    quantity: number;
  };
}
