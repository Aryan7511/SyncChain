const queries = `
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
    signin(input: SigninInput!): Token!
`;

export default queries;
