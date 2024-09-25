FROM node:20-slim AS base

RUN apt-get update

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base

COPY . /app

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

# Copy packages
COPY ${PACKAGES_PATH} ./${PACKAGES_PATH}

# Install all the dependencies
RUN pnpm install

# Enable hot reload
ENV CHOKIDAR_USEPOLLING=true

# Start command
CMD [ "pnpm", "--filter", "@world-of-studies/api", "dev" ]
