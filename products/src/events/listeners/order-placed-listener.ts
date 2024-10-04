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
    const { productId, quantity } = data;

    // Fetch the product by ID
    const product = await prismaClient.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = product.quantity - quantity;

    if (newQuantity < 0) {
      throw new Error("Product quantity can't be neagtive");
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: productId },
      data: {
        quantity: newQuantity // Update the quantity
      }
    });
    
    // Acknowledge the message
    msg.ack();
  }
}
