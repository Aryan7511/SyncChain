import express, { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';
import { prismaClient } from '../lib/db';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

const validateGetProduct = [
  param('id').isUUID().withMessage('Product ID must be a valid UUID')
];

router.get(
  '/api/products/:id',
  validateGetProduct,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    try {
      const product = await prismaClient.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new NotFoundError(); 
      }

      res.status(200).json({ success: true, product });
    } catch (error) {
      next(error); 
    }
  }
);

export { router as getProductByIdRouter };
