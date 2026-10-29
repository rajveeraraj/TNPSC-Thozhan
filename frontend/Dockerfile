# ===================================================
# Stage 1: Build React PWA Frontend
# ===================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code
COPY . .

# Build production assets (Vite -> dist/)
RUN npm run build

# ===================================================
# Stage 2: Production Web Server (Nginx)
# ===================================================
FROM nginx:alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom production nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
