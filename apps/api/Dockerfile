FROM node:20-alpine AS base

# Install pnpm
RUN npm i -g pnpm

FROM base

# Set up the work directory
WORKDIR /app

# Copy configuration files for pnpm
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .

# Variable sent from docker-compose
ARG APP_PATH=./my-folder

# Copy app
COPY ${APP_PATH} ./${APP_PATH}

# Install all the dependencies
RUN pnpm install

# Enable hot reload
ENV CHOKIDAR_USEPOLLING=true

# Start command
CMD [ "pnpm", "--filter", "@world-of-studies/api", "dev" ]
