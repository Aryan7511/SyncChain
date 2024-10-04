import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

import { ProductCreatedEvent } from '../event-types/product-created-event';
import { Listener } from './base-listener';
import { Subjects } from '../subjects';
import { prismaClient } from '../../lib/db';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    console.log(data);
    const { name, price, productId, quantity, description } = data;

    // Check if the product ID already exists
    const existingProduct = await prismaClient.product.findUnique({
      where: { id: productId }
    });

    if (existingProduct) {
      throw new Error('Product with the given productId already exists');
    }

    // Create the new product
    const newProduct = await prismaClient.product.create({
      data: {
        id: productId,
        name,
        price,
        quantity,
        description
      }
    });

    // Acknowledge the message
    msg.ack();
  }
}
