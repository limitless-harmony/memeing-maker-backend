const { env } = process;
export default {
  PORT: 4001,
  google: {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CLIENT_CALLBACK_URL,
  },
  linkedIn: {
    clientID: env.LINKEDIN_CLIENT_ID,
    clientSecret: env.LINKEDIN_CLIENT_SECRET,
    callbackURL: env.LINKEDIN_CLIENT_CALLBACK_URL,
  },
  facebook: {
    clientID: env.FACEBOOK_APP_ID,
    clientSecret: env.FACEBOOK_APP_SECRET,
    callbackURL: env.FACEBOOK_CLIENT_CALLBACK_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRY,
  },
  mongodb: {
    dbURI: env.MONGO_URI,
  }
};
