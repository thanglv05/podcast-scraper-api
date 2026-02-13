# Use official Playwright image with all dependencies
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 4000

# Set environment variable
ENV PORT=4000

# Start the application
CMD ["npm", "start"]
