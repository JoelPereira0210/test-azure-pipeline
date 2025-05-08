# Use Node.js LTS as the base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy everything (both client and server)
COPY . .

# Navigate to client directory
WORKDIR /app/client

# Install dependencies
RUN npm install

# Build the Next.js app
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
