import express, { NextFunction, Request, Response } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './apolloServer';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role?: string;
}

const getUserFromToken = (token: string) => {
  if (!token) return null;

  try {
    const secret = (process.env.JWT_SECRET as string) || 'asdfasdf';
    const user = jwt.verify(token, secret) as UserPayload;
    return user;
  } catch (error:any) {
    console.error('JWT verification failed:', error?.message);
    return null;
  }
};

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'Server is up and running' });
  });

  app.use(
    '/graphql',
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req, res }) => {
        // Get the user token from the headers.
        const token = req.headers.authorization || '';
        // console.log(token);

        // Try to retrieve a user with the token
        const user = getUserFromToken(token);

        // Add the user to the context
        return { user };
      }
    })
  );

  app.listen(PORT, () => console.log(`Api Gateway Service is up and running on PORT:${PORT}`));
}

init();
