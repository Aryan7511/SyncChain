import express, { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../lib/db';

const router = express.Router();

router.get('/api/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prismaClient.product.findMany();

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error); 
  }
});

export { router as getAllProductsRouter };
