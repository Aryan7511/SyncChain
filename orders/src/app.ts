import express, { NextFunction, Response, Request } from 'express';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { createOrderRouter } from './routes/createOrder';
import { getOrderByIdRouter } from './routes/getOrderById';
import { getAllOrdersRouter } from './routes/getOrders';
import morgan from 'morgan';

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'orders server is up and running' });
});

app.use(createOrderRouter);
app.use(getOrderByIdRouter);
app.use(getAllOrdersRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
