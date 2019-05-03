import Token from './Token';
import User from '../models/User';

export const google = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ googleId: profile.id });

  const {
    sub: googleId, name, picture: imageUrl, email
  } = profile._json;

  const newUser = new User({
    authProvider: profile.provider,
    googleId,
    name,
    imageUrl,
    email,
  });

  if (exisitingUser) return done(null, { 
    userId: exisitingUser._id,
    token: Token.sign(exisitingUser)
  });

  const newlyCreatedUser = await newUser.save();
  return done(null, { 
    userId: newlyCreatedUser._id,
    token: Token.sign(newlyCreatedUser)
  });
};

export const linkedin = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ linkedinId: profile.id });

  const {
    id: linkedinId, formattedName: name, pictureUrl: imageUrl, emailAddress: email
  } = profile._json;

  const newUser = new User({
    authProvider: profile.provider,
    linkedinId,
    name,
    imageUrl,
    email,
  });

  if (exisitingUser) return done(null, { 
    userId: exisitingUser._id,
    token: Token.sign(exisitingUser)
  });

  const newlyCreatedUser = await newUser.save();
  return done(null, {
    userId: newlyCreatedUser._id,
    token: Token.sign(newlyCreatedUser)
  });
};

export const facebook = async (accessToken, refreshToken, profile, done) => {
  const exisitingUser = await User.findOne({ facebookId: profile.id });

  const {
    id: facebookId, email, first_name: firstname, last_name: lastname
  } = profile._json;

  const newUser = new User({
    authProvider: profile.provider,
    facebookId,
    name: `${firstname} ${lastname}`,
    imageUrl: `https://graph.facebook.com/${facebookId}/picture?type=large`,
    email,
  });
  if (exisitingUser) return done(null, {
    userId: exisitingUser._id,
    token: Token.sign(exisitingUser)
   });

  const newlyCreatedUser = await newUser.save();
  return done(null, {
    userId: newlyCreatedUser._id,
    token: Token.sign(newlyCreatedUser)
   });
};
