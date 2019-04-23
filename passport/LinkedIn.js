import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { linkedin } from '../helpers/Passport';

import config from '../config/keys';

export default new LinkedInStrategy(config.linkedIn, linkedin);
