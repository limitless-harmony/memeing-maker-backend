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
  mongodb: {
    dbURI: process.env.MONGOURI,
  }
};
