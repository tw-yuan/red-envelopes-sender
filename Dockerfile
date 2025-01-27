# Use the official Node.js 16 image as the base image
FROM node:22.13.1-alpine AS base

# Set the working directory
WORKDIR /app
# Install pm2
RUN npm install pm2 -g

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pm2-runtime", "start", "npm", "--", "start"]