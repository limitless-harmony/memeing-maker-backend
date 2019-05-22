import Token from './Token';
import User from '../models/User';

const findUserByProviderOrEmail = async (provider, providerId, email) => {
  const query = User.findOne({ });
  const queryArguments = [{ [provider]: providerId }];
  if (email) queryArguments.push({ email });

  query.or(queryArguments);
  const user = await query.exec();
  return user;
};

const finishLogin = async (user, updateData, done) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { ...updateData },
    { returnNewDocument: true },
  );
  const { _id: id, role, isComplete } = updatedUser;
  const token = await Token.sign(user);
  return done(null, {
    id,
    role,
    token,
    isComplete,
  });
};

export const google = async (accessToken, refreshToken, profile, done) => {
  const { sub: googleId, name, picture: imageUrl, email } = profile._json;

  const existingUser = await findUserByProviderOrEmail('googleId', googleId, email);

  if (existingUser) return finishLogin(existingUser, { googleId, name, imageUrl }, done);

  const newUser = new User({
    googleId,
    name,
    imageUrl,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, { }, done);
};

export const linkedin = async (accessToken, refreshToken, profile, done) => {
  const { id: linkedinId, displayName: name, photos, emails } = profile;
  const imageUrl = photos[0].value;
  const email = emails[0].value;

  const existingUser = await findUserByProviderOrEmail('linkedinId', linkedinId, email);

  if (existingUser) return finishLogin(existingUser, { linkedinId, name, imageUrl }, done);

  const newUser = new User({
    linkedinId,
    name,
    imageUrl,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, {}, done);
};

export const facebook = async (accessToken, refreshToken, profile, done) => {
  const {
    id: facebookId,
    email,
    first_name: firstName,
    last_name: lastName,
  } = profile._json;
  const name = `${firstName} ${lastName}`;
  const imageUrl = `https://graph.facebook.com/${facebookId}/picture?type=large`;

  const existingUser = await findUserByProviderOrEmail('facebookId', facebookId, email);

  if (existingUser) return finishLogin(existingUser, { facebookId, name, imageUrl }, done);

  const newUser = new User({
    facebookId,
    name,
    imageUrl,
    email,
  });

  const newlyCreatedUser = await newUser.save();
  return finishLogin(newlyCreatedUser, {}, done);
};
