import { Publisher } from './base-publisher';
import { OrderPlacedEvent } from '../event-types/order-placed-event';
import { Subjects } from '../subjects';

export class OrderPlacedPublisher extends Publisher<OrderPlacedEvent> {
  readonly subject = Subjects.OrderPlaced;
}
  