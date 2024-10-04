import { Publisher } from './base-publisher';
import { OrderShippedEvent } from '../event-types/order-shipped-event';
import { Subjects } from '../subjects';

export class OrderShippedPublisher extends Publisher<OrderShippedEvent> {
  readonly subject = Subjects.OrderShipped;
}
  