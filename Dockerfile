# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app.
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the web service on container startup.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
