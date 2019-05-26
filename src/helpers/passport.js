import Token from './Token';
import User from '../models/User';

const findUserByProviderOrEmail = async (provider, providerId, email) =>
  User.findOne({
    $or: [{ email }, { [provider]: providerId }],
  });

const finishLogin = async (user, done) => {
  const {
    _id: id,
    role,
    username,
    image,
    isComplete,
    topText,
    bottomText,
  } = user;
  const token = await Token.sign(user);
  return done(null, {
    id,
    role,
    token,
    username,
    image,
    isComplete,
    topText,
    bottomText,
  });
};

export const google = async (accessToken, refreshToken, profile, done) => {
  const { sub: googleId, name, picture: image, email } = profile._json;

  const existingUser = await findUserByProviderOrEmail(
    'googleId',
    googleId,
    email
  );

  if (existingUser) return finishLogin(existingUser, done);

  const newUser = new User({
    googleId,
    name,
    image,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, done);
};

export const linkedin = async (accessToken, refreshToken, profile, done) => {
  const { id: linkedinId, displayName: name, photos, emails } = profile;
  const image = photos[0].value;
  const email = emails[0].value;

  const existingUser = await findUserByProviderOrEmail(
    'linkedinId',
    linkedinId,
    email
  );

  if (existingUser) return finishLogin(existingUser, done);

  const newUser = new User({
    linkedinId,
    name,
    image,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, done);
};

export const facebook = async (accessToken, refreshToken, profile, done) => {
  const {
    id: facebookId,
    email,
    first_name: firstName,
    last_name: lastName,
  } = profile._json;
  const name = `${firstName} ${lastName}`;
  const image = `https://graph.facebook.com/${facebookId}/picture?type=large`;

  const existingUser = await findUserByProviderOrEmail(
    'facebookId',
    facebookId,
    email
  );

  if (existingUser) return finishLogin(existingUser, done);

  const newUser = new User({
    facebookId,
    name,
    image,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, done);
};
