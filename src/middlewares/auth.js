import Token from '../helpers/Token';

const isLoggedIn = (req, res, next) => {
  const token = req.get('x-access-token') || req.body['x-access-token'];
  const user = Token.verify(token);
  if (!user) {
    return res.status(401)
      .json({ error: 'Invalid auth token' });
  }

  req.user = { userId: user.id };
  return next();
};

const isAuthorized = (req, res, next) => next();

export {
  isLoggedIn,
  isAuthorized,
};
