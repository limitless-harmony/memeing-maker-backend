import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import logger from './helpers/logger';
import routes from './routes';
import { responseSuccess } from './helpers';
import './config/passport';
import config from './config/keys';
import ApplicationError from './helpers/Error';

const app = express();
const { env } = process;

mongoose.Promise = global.Promise;

// DB CONNECTION INSTANCE
const dbUrl = env.MONGODB_URI || 'mongodb://localhost/MemeMakerDB';
mongoose
  .connect(dbUrl, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => logger.info('Connection to mongodb successful'))
  .catch(error => logger.debug('Unable to connect', error));

app.set('port', env.PORT || config.PORT);

app.use(cors());
app.use(passport.initialize());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) =>
  responseSuccess(
    200,
    {},
    'Welcome to Memeing Maker. Make meaning. Share memes',
    res
  )
);

app.use(routes);

app.use('*', (req, res, next) => {
  const message =
    "It looks like the route you requested doesn't exist. Please check the url and try again";
  throw new ApplicationError(message, 404);
});

app.use((err, req, res, next) => {
  err.status = 'error';
  if (!Number(err.code) || Number(err.code) > 600) {
    err.code = 500;
  }
  res.status(err.code || 500).json(err);
});

export default app;
