FROM nginx:1.15.2-alpine

RUN apk update
RUN apk add nodejs-npm=8.9.3-r1
RUN node -v && npm -v

COPY ./nginx.conf /etc/nginx/nginx.tmpl
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN NODE_ENV=production npm run build

CMD /bin/sh -c "envsubst '\$DEVELOPER_MS_SERVICE_HOST' < /etc/nginx/nginx.tmpl > /etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && nginx -g 'daemon off;' || cat /etc/nginx/nginx.conf"
