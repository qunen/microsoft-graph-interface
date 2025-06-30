FROM oven/bun:1.2-alpine
WORKDIR /usr/src/app

# Copy and install packages
COPY package*.json .
RUN bun install

# Copy and run server
COPY . .
CMD ["bun", "run", "src/index.ts"]