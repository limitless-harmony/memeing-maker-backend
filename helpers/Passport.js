import Token from './Token';
import User from '../models/User';

const makeUserFromProfile = (profile, extraFields) => {
  const {
    displayName: name,
    _json: { email, picture: imageUrl } = {}
  } = profile;

  const user = {
    name, email, imageUrl, ...extraFields
  };
  return user;
};

export const google = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ googleId: profile.id });
  const newUser = new User(makeUserFromProfile(profile, { googleId: profile.id }));
  const newlyCreatedUser = await newUser.save();
  if (exisitingUser) return done(null, { token: Token.sign(exisitingUser) });
  return done(null, { token: Token.sign(newlyCreatedUser) });
};

export const linkedin = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ linkedinId: profile.id });
  const newUser = new User(makeUserFromProfile(profile, { linkedinId: profile.id }));
  const newlyCreatedUser = await newUser.save();
  if (exisitingUser) return done(null, { token: Token.sign(exisitingUser) });
  return done(null, { token: Token.sign(newlyCreatedUser) });
};

export const facebook = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ facebookId: profile.id });
  const newUser = new User(makeUserFromProfile(profile, { facebookId: profile.id }));
  const newlyCreatedUser = await newUser.save();
  if (exisitingUser) return done(null, { token: Token.sign(exisitingUser) });
  return done(null, { token: Token.sign(newlyCreatedUser) });
};
