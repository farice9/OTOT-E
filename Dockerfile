FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY index.js workout.js MOCK_DATA.json ./
COPY model/ model/
EXPOSE 8000/tcp
CMD ["npm", "start"]