FROM node:18-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

ADD bin /opt/app/bin
ADD lib /opt/app/lib
COPY package.json /opt/app/
COPY package-lock.json /opt/app/

RUN npm install

EXPOSE 8080

CMD ["/opt/app/bin/httpbin.js"]
