import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { prismaClient } from '../lib/db';
import { Password } from '../utils/password';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { UserRegisteredPublisher } from '../events/publishers/user-registered-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validateCreateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be valid')
    .customSanitizer((value) => value.toLowerCase()),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name must contain only alphabetic characters')
    .customSanitizer((value) => value.toLowerCase()),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name must contain only alphabetic characters')
    .customSanitizer((value) => value.toLowerCase()),
  body('location')
    .trim()
    .customSanitizer((value) => value.toLowerCase()),
  body('contactNumber')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Invalid contact number')
];

router.post(
  '/api/users',
  validateCreateUser,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, location, contactNumber } =
      req.body;
    try {
      // Check if the user already exists
      const existingUser = await prismaClient.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new BadRequestError('Email already in use');
      }

      // Hash the password before saving to the database
      const hashedPassword = await Password.toHash(password);

      // Create a new user in the database
      const newUser = await prismaClient.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          location,
          contactNumber
        }
      });

      // Generate a JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        (process.env.JWT_SECRET as string) || 'asdf',
        { expiresIn: '3h' } // Token expiration time
      );

      // Exclude password field from the user object
      const { password: _, ...userWithoutPassword } = newUser;

      await new UserRegisteredPublisher(natsWrapper.client).publish({
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        contactNumber: newUser.contactNumber,
        location: newUser.location
      });

      // Respond with success message and the token
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      next(error); // Pass the error to the Error handling middleware
    }
  }
);

export { router as createUserRouter };
