FROM node:20-slim

RUN apt-get update

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app
