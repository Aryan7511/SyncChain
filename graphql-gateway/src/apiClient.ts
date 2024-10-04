import axios from 'axios';
import { GraphQLError } from 'graphql';
import { getReasonPhrase } from 'http-status-codes';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379
});

const USERS_SERVICE_URL = `${process.env.USER_SERVICE_URL}/api/users`;
const PRODUCTS_SERVICE_URL = `${process.env.PRODUCT_SERVICE_URL}/api/products`;
const ORDERS_SERVICE_URL = `${process.env.ORDER_SERVICE_URL}/api/orders`;

const CACHE_EXPIRATION = 60; // Cache expiration time in seconds

// Helper function for GET requests with caching
export const get = async (url: string, useCache = false, cacheKey?: string) => {
  if (useCache && cacheKey) {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Cache the response if caching is enabled
    if (useCache && cacheKey) {
      await redis.set(cacheKey, JSON.stringify(data), 'EX', CACHE_EXPIRATION);
    }

    return data;
  } catch (error) {
    handleAxiosError(error, url);
  }
};

// Helper function for POST requests
export const post = async (url: string, data: any) => {
  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, url);
  }
};

// Centralized error handling
const handleAxiosError = (error: any, url: string) => {
  console.error(
    `Error calling ${url}:`,
    error?.response?.data || error.message
  );
  const statusCode = error?.response?.data?.statusCode || 500;
  const errorMessage =
    error?.response?.data?.errors[0]?.message || 'Something Went Wrong...';
  const statusText = getReasonPhrase(statusCode);

  throw new GraphQLError(errorMessage, {
    extensions: {
      code: statusText,
      statusCode: statusCode
    }
  });
};

// API Calls for each service
export const userService = {
  getAllUsers: () => get(USERS_SERVICE_URL),
  getUserById: (id: string) => get(`${USERS_SERVICE_URL}/${id}`),
  registerUser: (input: any) => post(USERS_SERVICE_URL, input),
  signinUser: (input: any) => post(`${USERS_SERVICE_URL}/token`, input)
};

export const productService = {
  getAllProducts: () => get(PRODUCTS_SERVICE_URL, true, 'all_products_cache'),
  getProductById: (id: string) => get(`${PRODUCTS_SERVICE_URL}/${id}`),
  createProduct: (input: any) => post(PRODUCTS_SERVICE_URL, input)
};

export const orderService = {
  getAllOrders: () => get(ORDERS_SERVICE_URL),
  getOrderById: (id: string) => get(`${ORDERS_SERVICE_URL}/${id}`),
  placeOrder: (input: any) => post(ORDERS_SERVICE_URL, input)
};
