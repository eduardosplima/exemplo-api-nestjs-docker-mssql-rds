##################################################

FROM node:20-alpine AS builder

ARG BUILD_CMD="npm run build:prod"

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN ${BUILD_CMD}

##################################################

FROM node:20-alpine AS package

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit dev
RUN npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

USER node
CMD node dist/main

##################################################