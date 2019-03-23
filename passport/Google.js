import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { google } from '../helpers/Passport';

import config from '../config/keys';

export default new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: '/auth/google/success',
}, google);
