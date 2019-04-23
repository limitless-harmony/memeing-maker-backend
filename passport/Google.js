import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { google } from '../helpers/Passport';

import config from '../config/keys';

export default new GoogleStrategy(config.google, google);
