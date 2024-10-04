import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

import { OrderPlacedEvent } from '../event-types/order-placed-event';
import { Listener } from './base-listener';
import { Subjects } from '../subjects';
import { prismaClient } from '../../lib/db';

export class OrderPlacedListener extends Listener<OrderPlacedEvent> {
  readonly subject = Subjects.OrderPlaced;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderPlacedEvent['data'], msg: Message) {
    console.log(data);

    // Extracting data from the data
    const {
      orderId,
      productId,
      createdAt,
      quantity,
      status,
      totalAmount,
      userId,
      productName
    } = data;

    // Insert data into the Order table
    const newOrder = await prismaClient.order.create({
      data: {
        id: orderId,
        userId: userId,
        productId: productId,
        productName: productName,
        totalAmount: totalAmount,
        quantity: quantity,
        status: status as any ,
        createdAt: createdAt
      }
    });

    // Acknowledge the message
    msg.ack();
  }
}
