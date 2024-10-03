import axios from 'axios';
import { GraphQLError } from 'graphql';
import { getReasonPhrase } from 'http-status-codes';

const USERS_SERVICE_URL = `${process.env.USER_SERVICE_URL}/api/users`;
const PRODUCTS_SERVICE_URL = `${process.env.PRODUCT_SERVICE_URL}/api/products`;
const ORDERS_SERVICE_URL = `${process.env.ORDER_SERVICE_URL}/api/orders`;

// Helper function for GET requests
export const get = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
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
  getAllProducts: () => get(PRODUCTS_SERVICE_URL),
  getProductById: (id: string) => get(`${PRODUCTS_SERVICE_URL}/${id}`),
  createProduct: (input: any) => post(PRODUCTS_SERVICE_URL, input)
};

export const orderService = {
  getAllOrders: () => get(ORDERS_SERVICE_URL),
  getOrderById: (id: string) => get(`${ORDERS_SERVICE_URL}/${id}`),
  placeOrder: (input: any) => post(ORDERS_SERVICE_URL, input)
};
