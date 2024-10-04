import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

import { OrderShippedEvent } from '../event-types/order-shipped-event';
import { Listener } from './base-listener';
import { Subjects } from '../subjects';

export class OrderShippedListener extends Listener<OrderShippedEvent> {
  readonly subject = Subjects.OrderShipped;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderShippedEvent['data'], msg: Message) {
    // // Find the ticket that the order is reserving
    // const ticket = await Ticket.findById(data.ticket.id);

    // // If no ticket, throw error
    // if (!ticket) {
    //   throw new Error('Ticket not found');
    // }

    // // Mark the ticket as being reserved by setting its orderId property
    // ticket.set({ orderId: data.id });

    // // Save the ticket
    // await ticket.save();

    // // Publish an event indicating that the ticket has been updated
    // await new TicketUpdatedPublisher(this.client).publish({
    //   id: ticket.id,
    //   price: ticket.price,
    //   title: ticket.title,
    //   userId: ticket.userId,
    //   orderId: ticket.orderId,
    //   version: ticket.version
    // });

    // Acknowledge the message
    msg.ack();
  }
}
