import Token from './Token';
import User from '../models/User';

export const google = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ googleId: profile.id });
  const newUser = new User({
    name: profile.displayName,
    email: profile._json.email,
    googleId: profile.id,
    imageUrl: profile._json.picture,
  });
  const newlyCreatedUser = await newUser.save();
  if (exisitingUser) return done(null, { token: Token.sign(exisitingUser) });
  return done(null, { token: Token.sign(newlyCreatedUser) });
};


export const linkedin = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ googleId: profile.id });
  const newUser = new User({
    name: profile.displayName,
    email: profile._json.email,
    googleId: profile.id,
    imageUrl: profile._json.picture,
  });
  const newlyCreatedUser = await newUser.save();
  if (exisitingUser) return done(null, { token: Token.sign(exisitingUser) });
  return done(null, { token: Token.sign(newlyCreatedUser) });
};
