import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import logger from 'console';
import routes from './routes';

const app = express();
const env = process.env.NODE_ENV || 'development';
const PORT = env === 'development' ? 4001 : process.env.PORT;


mongoose.Promise = global.Promise;

// DB CONNECTION INSTANCE
mongoose.connect('mongodb://localhost/MemeMakerDB', {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(() => logger.log('Connection to mongodb successful'))
  .catch(error => logger.log('Unable to connect', error));


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

routes(app);

app.get('/', (req, res) => res.send('Send memes'));

app.listen(PORT, () => logger.log(`Listening on ${PORT}!`));

export default app;