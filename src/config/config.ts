import * as dotenv from 'dotenv';
dotenv.config();

const env =
  process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;

export default {
  NODE_ENV: env,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  DEVELOPMENT: {
    PORT: process.env.DEVELOPMENT_PORT,
    MONGO_URI: process.env.DEVELOPMENT_MONGO_URI,
  },
  PRODUCTION: {
    PORT: process.env.PRODUCTION_PORT,
    MONGO_URI: process.env.PRODUCTION_MONGO_URI,
  },
};
