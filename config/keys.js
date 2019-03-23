export default {
  PORT: 4001,
  google: {
    clientID: process.env.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret,
  },
  linkedIn: {
    clientID: process.env.LinkedInClientID,
    clientSecret: process.env.LinkedInClientSecret,
  },
  facebook: {
    clientID: process.env.FacebookAPPID,
    clientSecret: process.env.FacebookAPPSecret,
  },
  jwt: {
    secret: process.env.JWTSecret,
    expiresIn: process.env.JWTExpiry,
  },
  mongodb: {
    dbURI: process.env.MONGOURI,
  }
};
