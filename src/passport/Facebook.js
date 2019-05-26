import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebook } from '../helpers/passport';

import config from '../config/keys';

export default new FacebookStrategy(
  {
    ...config.facebook,
    scope: ['email', 'public_profile'],
    profileFields: ['id', 'email', 'first_name', 'last_name', 'picture'],
  },
  facebook
);
