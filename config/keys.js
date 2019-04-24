export default {
  PORT: 4001,
  google: {
    clientID: process.env.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret,
    callbackURL: '/auth/google/success',
  },
  linkedIn: {
    clientID: process.env.LinkedInClientID,
    clientSecret: process.env.LinkedInClientSecret,
    callbackURL: '/auth/linkedin/success',
  },
  facebook: {
    clientID: process.env.FacebookAPPID,
    clientSecret: process.env.FacebookAPPSecret,
    callbackURL: '/auth/facebook/success',
  },
  jwt: {
    secret: process.env.JWTSecret,
    expiresIn: process.env.JWTExpiry,
  },
  mongodb: {
    dbURI: process.env.MONGOURI,
  }
};
