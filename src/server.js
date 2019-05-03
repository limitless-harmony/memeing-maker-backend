import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import logger from 'console';
import routes from './routes';
import { responseSuccess, responseError } from './helpers';
import './config/passport';
import config from './config/keys';

const app = express();
const PORT = process.env.PORT || config.PORT;

mongoose.Promise = global.Promise;

// DB CONNECTION INSTANCE
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/MemeMakerDB';
mongoose.connect(dbUrl, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true
})
  .then(() => logger.log('Connection to mongodb successful'))
  .catch(error => logger.log('Unable to connect', error));

app.use(cors());
app.use(passport.initialize());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => responseSuccess(
  200,
  {},
  'Welcome to Memeing Maker. Make meaning. Share memes',
  res
));

app.use(routes);

app.use('*', (req, res) => responseError(
  404,
  {},
  "It looks like the route you requested didn't exist. Please check the url and try again",
  res
));


app.listen(PORT, () => logger.log(`Listening on ${PORT}!`));

export default app;
