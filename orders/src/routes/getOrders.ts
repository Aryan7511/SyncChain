import express, { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../lib/db';

const router = express.Router();

router.get(
  '/api/orders',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await prismaClient.order.findMany({
        include: {
          user: true,
          product: true
        }
      });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as getAllOrdersRouter };
