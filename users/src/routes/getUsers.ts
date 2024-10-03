import express, { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../lib/db';

const router = express.Router();

// Route to get all users
router.get(
  '/api/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve all users from the database
      const users = await prismaClient.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          location: true,
          contactNumber: true,
          createdAt: true
        }
      });
      // Respond with the list of users
      res.status(200).json({ success: true, users });
    } catch (error) {
      next(error); // Pass the error to the Error handling middleware
    }
  }
);

export { router as getAllUsersRouter };
