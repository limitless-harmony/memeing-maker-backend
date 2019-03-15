export default {
  PORT: 4001,
  google: {
    clientID: process.env.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret,
  },
  mongodb: {
    dbURI: process.env.MONGOURI,
  }
};
