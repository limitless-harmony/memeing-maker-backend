import GoogleStrategy from 'passport-google-oauth20';

import User from '../models/User';
import config from '../config/keys';

export default new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: '/auth/google/success',
}, (accessToken, refresh, profile, done) => User.findOne({ googleId: profile.id })
  .then((isExistingUser) => {
    if (isExistingUser) {
      done(null, isExistingUser);
    } else {
      const newUser = new User({
        name: profile.displayName,
        email: profile._json.email,
        googleId: profile.id,
        imageUrl: profile._json.picture,
      });
      return newUser.save()
        .then((user) => {
          done(null, user);
        });
    }
  }));
