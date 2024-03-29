FROM node:20-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
