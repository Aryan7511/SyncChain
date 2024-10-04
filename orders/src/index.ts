import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { UserRegisteredListener } from './events/listeners/user-registered-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
import { ProductCreatedListener } from './events/listeners/product-created-listener';
import { ProductUpdatedListener } from './events/listeners/product-updated-event';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    //Listening for Nats-Events
    new UserRegisteredListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductUpdatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log('Orders Service is up and running on PORT 3000!!!!!');
  });
};

start();
