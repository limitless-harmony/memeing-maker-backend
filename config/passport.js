import passport from 'passport';

import GoogleStrategy from '../passport/Google';

passport.use(GoogleStrategy);

export default passport;
