FROM node:14.17.6

# Create app directory
WORKDIR /usr/src/app

ARG NPM_TOKEN

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY ./web-ui/package*.json ./web-ui/

RUN npm install --only=production
# If you are building your code for production
# RUN npm install --only=production

FROM node:14.17.6
WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/node_modules ./node_modules

COPY . .

COPY ./web-ui ./web-ui
RUN npm run install-webui

RUN npm run build
EXPOSE 8080
CMD [ "npm", "start" ]