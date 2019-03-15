import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import logger from 'console';

import './config/passport';

import config from './config/keys';
import AuthRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || config.PORT;

mongoose.Promise = global.Promise;

mongoose.connect(config.mongodb.dbURI, {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(() => logger.log('Connection to mongodb successful'))
  .catch(error => logger.log('Unable to connect', error));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', AuthRoutes);

app.listen(PORT, () => logger.log(`Listening on ${PORT}!`));

export default app;
