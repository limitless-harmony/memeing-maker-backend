import { Strategy as FacebookStrategy } from 'passport-facebook';

import User from '../models/User';
import config from '../config/keys';

export default new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: '/auth/facebook/success',
}, (accessToken, refresh, profile, done) => User.findOne({ facebookId: profile.id })
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
