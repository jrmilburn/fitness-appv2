# Example Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app’s source code
COPY . .

# Build production version of Next
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Run the start script
CMD ["npm", "run", "start"]
