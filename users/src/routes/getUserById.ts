import express, { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';
import { prismaClient } from '../lib/db';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

const validateGetUser = [
  param('id').isUUID().withMessage('User ID must be a valid UUID')
];

// Route to get a single user by ID
router.get(
  '/api/users/:id',
  validateGetUser,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    try {
      // Retrieve the user by ID
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
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

      if (!user) {
        throw new NotFoundError(); 
      }

      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error); 
    }
  }
);

export { router as getUserByIdRouter };
