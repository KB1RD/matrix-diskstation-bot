FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install
RUN npm run build

EXPOSE 8080
ENV NODE_ENV=production
CMD [ "node", "lib/index.js" ]
