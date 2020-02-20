FROM node:11.14.0

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY ./web-ui/package*.json ./web-ui/

RUN npm install --only=production
COPY . .

COPY ./web-ui ./web-ui
RUN npm run postinstall
# If you are building your code for production
# RUN npm install --only=production


EXPOSE 8080
CMD [ "npm", "start" ]