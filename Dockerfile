FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Svelte app
RUN bun run build

# Expose the port the app runs on
EXPOSE 5173

# Start the development server
CMD ["bun", "run", "dev", "--host"]
