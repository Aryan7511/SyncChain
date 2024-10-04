import { RegisterInput, ProductInput, OrderInput } from './types';
import { userService, productService, orderService } from './apiClient';
import { GraphQLError } from 'graphql';

const resolvers = {
  queries: {
    users: async () => {
      const data = await userService.getAllUsers();
      const users = data.users;
      return users;
    },
    user: async (parent: any, { id }: { id: string }) => {
      const data = await userService.getUserById(id);
      const user = data.user;
      return user;
    },
    products: async () => {
      const data = await productService.getAllProducts();
      const products = data.products;
      return products;
    },
    product: async (parent: any, { id }: { id: string }) => {
      const data = await productService.getProductById(id);
      const product = data.product;
      return product;
    },
    orders: async () => {
      const data = await orderService.getAllOrders();
      const orders = data.orders;
      return orders;
    },
    order: async (parent: any, { id }: { id: string }) => {
      const data = await orderService.getOrderById(id);
      const order = data.order;
      return order;
    },
    signin: async (
      parent: any,
      { input }: { input: { email: string; password: string } }
    ) => {
      const data = await userService.signinUser(input);
      const token = data.token;
      return { token: token };
    }
  },

  mutations: {
    registerUser: async (parent: any, { input }: { input: RegisterInput }) => {
      const data = await userService.registerUser(input);
      const user = data.user;
      return user;
    },
    createProduct: async (
      parent: any,
      { input }: { input: ProductInput },
      contextValue: any
    ) => {
      if (
        !contextValue.user ||
        !contextValue.user.role ||
        contextValue.user.role !== 'admin'
      ) {
        throw new GraphQLError('Only admin can create products!', {
          extensions: {
            code: 'Forbidden',
            statusCode: 403
          }
        });
      }

      const data = await productService.createProduct(input);
      const product = data.product;
      return product;
    },
    placeOrder: async (
      parent: any,
      { input }: { input: OrderInput },
      contextValue: any
    ) => {
      if (!contextValue.user) {
        throw new GraphQLError('Authentication required to place an order!', {
          extensions: {
            code: 'Unauthorized',
            statusCode: 401
          }
        });
      }
      const inputData = {
        ...input,
        userId: contextValue.user.userId as String
      };
      const data = await orderService.placeOrder(inputData);
      const order = data.order;
      return order;
    }
  }
};

export { resolvers };

