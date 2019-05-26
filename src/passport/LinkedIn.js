import { Strategy as LinkedInStrategy } from '@sokratis/passport-linkedin-oauth2';
import { linkedin } from '../helpers/passport';

import config from '../config/keys';

export default new LinkedInStrategy(
  {
    ...config.linkedIn,
    scope: ['r_emailaddress', 'r_liteprofile'],
  },
  linkedin
);
