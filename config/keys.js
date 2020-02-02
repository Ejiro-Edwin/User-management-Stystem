require('dotenv').config();

const {
  PORT,
  MONGO_URL,
  JWT_SECRET,
} = process.env;

module.exports = {
  port: PORT,
  jwtSecret: JWT_SECRET,
  mongoConnect: MONGO_URL,
};