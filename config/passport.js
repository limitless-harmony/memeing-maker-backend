import passport from 'passport';

import GoogleStrategy from '../passport/Google';
import LinkedInStrategy from '../passport/LinkedIn';

passport.use(GoogleStrategy);
passport.use(LinkedInStrategy);

export default passport;
