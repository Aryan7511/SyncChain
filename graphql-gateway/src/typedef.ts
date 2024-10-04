const typeDefs = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    location: String!
    contactNumber: String
    createdAt: String
  }

  type Product {
    id: ID!
    name: String!
    price: Int!
    description: String!
    quantity: Int!
    createdAt: String
    updatedAt: String
  }

  type Order {
    id: ID!
    userId: String!
    productId: String!
    product: Product!
    user: User!
    quantity: Int!
    totalAmount: Int!
    status: String!
    createdAt: String
  }

  type Token {
    token: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    location: String!
    contactNumber: String!
  }

  input ProductInput {
    name: String!
    price: Int!
    description: String!
    quantity: Int!
  }

  input OrderInput {
    productId: ID!
    quantity: Int!
  }

  input SigninInput {
  email: String!
  password: String!
  }
`;

export default typeDefs;
