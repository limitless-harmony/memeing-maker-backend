import Token from './Token';
import User from '../models/User';

const findByEmail = async email => User.findOne({ email });

const finishLogin = async (user, done) => {
  const { _id: id, role } = user;
  const token = await Token.sign(user);
  return done(null, {
    id,
    role,
    token,
  });
};
export const google = async (accessToken, refreshToken, profile, done) => {
  const {
    sub: googleId, name, picture: imageUrl, email
  } = profile._json;

  const existingUser = await findByEmail(email);

  if (existingUser) return finishLogin(existingUser, done);

  const newUser = new User({
    authProvider: profile.provider,
    googleId,
    name,
    imageUrl,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, done);
};

export const linkedin = async (accessToken, refreshToken, profile, done) => {
  const {
    id: linkedinId, displayName: name, photos, emails
  } = profile;
  const imageUrl = photos[0].value;
  const email = emails[0].value;
  const existingUser = await findByEmail(email);

  if (existingUser) return finishLogin(existingUser, done);

  const newUser = new User({
    authProvider: profile.provider,
    linkedinId,
    name,
    imageUrl,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, done);
};

export const facebook = async (accessToken, refreshToken, profile, done) => {
  const {
    id: facebookId, email, first_name: firstName, last_name: lastName
  } = profile._json;

  const existingUser = await findByEmail(email);

  if (existingUser) return finishLogin(existingUser, done);

  const newUser = new User({
    authProvider: profile.provider,
    facebookId,
    name: `${firstName} ${lastName}`,
    imageUrl: `https://graph.facebook.com/${facebookId}/picture?type=large`,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, done);
};
