FROM node:11.14.0

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY ./src/web-ui/package*.json ./web-ui/

RUN npm install
COPY . .
RUN npm run build

COPY ./src/web-ui ./web-ui
RUN npm run install-webui
# If you are building your code for production
# RUN npm install --only=production


EXPOSE 8080
CMD [ "node", "./dist/index.js" ]
