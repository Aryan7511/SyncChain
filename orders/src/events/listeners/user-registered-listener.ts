import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

import { UserRegisteredEvent } from '../event-types/user-registered-event';
import { Listener } from './base-listener';
import { Subjects } from '../subjects';
import { prismaClient } from '../../lib/db';

export class UserRegisteredListener extends Listener<UserRegisteredEvent> {
  readonly subject = Subjects.UserRegistered;
  queueGroupName = queueGroupName;

  async onMessage(data: UserRegisteredEvent['data'], msg: Message) {
    console.log(data);
    const { email, userId, firstName, lastName, location, contactNumber } =
      data;

    const existingUser = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      throw new Error('User with the given userId already exists.');
    }
    const newUser = await prismaClient.user.create({
      data: {
        id: userId,
        email,
        firstName,
        lastName,
        location,
        contactNumber
      }
    });

    // Acknowledge the message
    msg.ack();
  }
}
