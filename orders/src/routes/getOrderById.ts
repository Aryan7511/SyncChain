import express, { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';
import { prismaClient } from '../lib/db';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

const validateGetOrder = [
  param('id').isUUID().withMessage('Order ID must be a valid UUID')
];

router.get(
  '/api/orders/:id',
  validateGetOrder,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    try {
      const order = await prismaClient.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          product: true
        }
      });

      if (!order) {
        throw new NotFoundError();
      }

      res.status(200).json({ success: true, order });
    } catch (error) {
      next(error);
    }
  }
);

export { router as getOrderByIdRouter };
