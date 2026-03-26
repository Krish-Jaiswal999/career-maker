FROM nginx:latest-alpine

# Copy nginx config
COPY ../nginx.conf /etc/nginx/nginx.conf

# Copy frontend static files
COPY ./ /usr/share/nginx/html/

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
