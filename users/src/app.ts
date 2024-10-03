import express, { NextFunction, Response, Request } from 'express';
import { NotFoundError } from './errors/not-found-error';
import { createUserRouter } from './routes/createUser';
import { errorHandler } from './middlewares/error-handler';
import { getAllUsersRouter } from './routes/getUsers';
import { getUserByIdRouter } from './routes/getUserById';
import { getUserTokenRouter } from './routes/getUserToken';
import morgan from 'morgan';
import { get } from 'http';

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'users Server is up and running' });
});

app.use(createUserRouter);
app.use(getAllUsersRouter);
app.use(getUserByIdRouter);
app.use(getUserTokenRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
