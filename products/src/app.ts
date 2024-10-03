import express, { NextFunction, Response, Request } from 'express';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { createProductRouter } from './routes/createProduct';
import { getProductByIdRouter } from './routes/getProductById';
import { getAllProductsRouter } from './routes/getProducts';
import morgan from 'morgan';

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'products server is up and running' });
});

app.use(createProductRouter);
app.use(getAllProductsRouter);
app.use(getProductByIdRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
