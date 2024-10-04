import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderPlacedListener } from './events/listeners/order-placed-listener';
import { OrderShippedListener } from './events/listeners/order-shipped-listener';

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
    new OrderPlacedListener(natsWrapper.client).listen();
    new OrderShippedListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log('Users Service is up and running on PORT 3000!!!!!');
  });
};

start();
