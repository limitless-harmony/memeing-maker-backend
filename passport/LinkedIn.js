import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

import User from '../models/User';
import config from '../config/keys';

export default new LinkedInStrategy({
  clientID: config.linkedIn.clientID,
  clientSecret: config.linkedIn.clientSecret,
  callbackURL: '/auth/linkedin/success'
}, (accessToken, refresh, profile, done) => User.findOne({ linkedInId: profile.id })
  .then((isExistingUser) => {
    console.log('User exists');
    if (isExistingUser) {
      done(null, isExistingUser);
    } else {
      console.log('New User');
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        linkedInId: profile.id,
        imageUrl: profile._json.pictureUrl,
      });
      return newUser.save()
        .then((user) => {
          done(null, user);
        });
    }
  }));
