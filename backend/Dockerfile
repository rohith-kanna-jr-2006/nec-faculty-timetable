FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend and root constants
COPY backend ./backend
COPY constants ./constants

WORKDIR /app/backend

# Expose backend port
EXPOSE 5000

# Default command
CMD ["node", "src/server.js"]
