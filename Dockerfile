FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port 4200 for Angular dev server
EXPOSE 4200

# Start development server with host 0.0.0.0 to allow external connections
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"] 