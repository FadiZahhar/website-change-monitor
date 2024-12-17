# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "src/app.js"]
