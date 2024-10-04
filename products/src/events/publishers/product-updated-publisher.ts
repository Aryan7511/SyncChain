import { Publisher } from './base-publisher';
import { ProductUpdatedEvent } from '../event-types/product-updated-event';
import { Subjects } from '../subjects';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  readonly subject = Subjects.InventoryUpdated;
}
  