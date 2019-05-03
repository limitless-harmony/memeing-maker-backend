import passport from 'passport';

import GoogleStrategy from '../passport/Google';
import LinkedInStrategy from '../passport/LinkedIn';
import FacebookStrategy from '../passport/Facebook';

passport.use(GoogleStrategy);
passport.use(LinkedInStrategy);
passport.use(FacebookStrategy);

export default passport;
