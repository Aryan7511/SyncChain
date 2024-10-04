export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  contactNumber: string;
  role?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: User;
  product: Product;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  contactNumber: string;
}

export interface ProductInput {
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export interface OrderInput {
  productId: string;
  quantity: number;
}
