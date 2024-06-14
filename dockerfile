FROM node:21.6.1-bullseye
WORKDIR /
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm build
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build", "-l", "5000"]