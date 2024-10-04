import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { prismaClient } from '../lib/db';
import { validateRequest } from '../middlewares/validate-request';
import { ProductCreatedPublisher } from '../events/publishers/product-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .customSanitizer((value) => value.toLowerCase()),
  body('description')
    .optional()
    .trim()
    .customSanitizer((value) => value.toLowerCase()),
  body('price')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Price field must be a greater than 0'),
  body('quantity')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Quantity field must be a greater than 0')
];

router.post(
  '/api/products',
  validateCreateProduct,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, quantity } = req.body;

    try {
      // Create the new product
      const newProduct = await prismaClient.product.create({
        data: {
          name,
          description: description,
          price: Number(price),
          quantity: Number(quantity)
        }
      });

      await new ProductCreatedPublisher(natsWrapper.client).publish({
        productId: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        quantity: newProduct.quantity,
        description: newProduct.description as string
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createProductRouter };
