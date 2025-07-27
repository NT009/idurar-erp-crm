# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the app port (adjust if different)
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:prod"]

