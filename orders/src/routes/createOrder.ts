import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { prismaClient } from '../lib/db'; // Adjust the import path as necessary
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { OrderPlacedPublisher } from '../events/publishers/order-placed-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validateCreateOrder = [
  body('userId').trim().notEmpty().withMessage('User ID is required'),
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Quantity must be greater than 0')
];

router.post(
  '/api/orders',
  validateCreateOrder,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId, quantity } = req.body;
    try {
      const userExists = await prismaClient.user.findUnique({
        where: { id: userId }
      });
      if (!userExists) {
        throw new BadRequestError('Invalid userId');
      }

      const productExists = await prismaClient.product.findUnique({
        where: { id: productId }
      });
      if (!productExists) {
        throw new BadRequestError('Invalid ProductId');
      }

      if (productExists.quantity < quantity) {
        throw new BadRequestError('Insufficient quantity available');
      }

      // Create the new order
      const newOrder = await prismaClient.order.create({
        data: {
          userId,
          productId,
          quantity: Number(quantity),
          totalAmount: productExists.price * quantity,
          status: 'PLACED'
        },
        include: {
          user: true,
          product: true
        }
      });

      await prismaClient.product.update({
        where: { id: productId },
        data: {
          quantity: productExists.quantity - quantity
        }
      });

      await new OrderPlacedPublisher(natsWrapper.client).publish({
        orderId: newOrder.id,
        productId: newOrder.productId,
        productName: productExists.name,
        userId: newOrder.userId,
        quantity: newOrder.quantity,
        status: newOrder.status,
        totalAmount: newOrder.totalAmount,
        createdAt: newOrder.createdAt.toISOString()
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: newOrder
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createOrderRouter };
