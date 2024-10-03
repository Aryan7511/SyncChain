# Use official Node.js LTS image as base
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

#  Set environment variables
ENV JWT_SECRET=asdfasdf

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["npm", "start"]
