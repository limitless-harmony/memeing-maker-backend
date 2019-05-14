import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { google } from '../helpers/passport';

import config from '../config/keys';

export default new GoogleStrategy({
  ...config.google,
  scope: ['profile', 'email'],
}, google);
