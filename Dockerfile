# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# Use npm ci for faster, reliable, reproducible builds when lockfile exists
RUN npm ci --omit=dev && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create data directory for database storage
RUN mkdir -p /app/data

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S botuser -u 1001

# Change ownership of the app directory to the botuser
RUN chown -R botuser:nodejs /app
USER botuser

# Expose the port the app runs on (if needed for health checks)
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Define the command to run the application
CMD ["node", "main.js"]
