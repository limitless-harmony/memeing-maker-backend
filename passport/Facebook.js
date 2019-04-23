import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebook } from '../helpers/Passport';

import config from '../config/keys';

export default new FacebookStrategy(config.facebook, facebook);
