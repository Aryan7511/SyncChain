import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), statusCode: err.statusCode });
  } else {
    res.status(400).send({
      errors: [{ message: 'Something Went Wrong!!!!' }],
      statusCode: 400
    });
  }
};
