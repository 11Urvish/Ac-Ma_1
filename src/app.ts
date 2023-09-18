import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import passport from 'passport';

dotenv.config();
import ApiRoutes from './routes';

const origins = [
  'https://everix.in',
  'https://dhiranbook.in',
  'http://localhost:4200',
];

class App {
  express: express.Application;

  constructor() {
    this.express = express();
    this.initApp();
  }

  private initApp() {
    this.setMiddlewares();
    this.setRoutes();
  }

  setMiddlewares() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(logger('dev'));
    this.express.use(compression());
    this.express.use(helmet());
    this.express.use(
      cors({
        origin: (origin: any, callback) => {
          console.log(origin);
          if (!origin) return callback(null, true);
          if (origins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from ${origin} Origin.`;
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
    );
  }

  setRoutes() {
    require('./passport/index')(passport);
    this.express.use('/api', ApiRoutes);
  }
}

export default new App().express;
