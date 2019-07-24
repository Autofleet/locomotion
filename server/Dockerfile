FROM node:11.14.0

# Create app directory
WORKDIR /usr/src/app

ARG NPM_TOKEN

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN rm -f .npmrc

EXPOSE 8080
CMD [ "npm", "start" ]
