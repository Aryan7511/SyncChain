import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

import { UserUpdatedEvent } from '../event-types/user-updated-event';
import { Listener } from './base-listener';
import { Subjects } from '../subjects';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
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
