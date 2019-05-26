import Token from '../helpers/Token';
import ApplicationError from '../helpers/Error';

const isLoggedIn = async (req, res, next) => {
  const token = req.get('x-access-token') || req.body['x-access-token'];

  if (!token) {
    return next(
      new ApplicationError('You must be logged in to access this!', 401)
    );
  }

  const user = await Token.verify(token);
  if (!user) {
    return next(
      new ApplicationError('Invalid Authentication token. Please Login!', 401)
    );
  }

  const isAdmin = user.role === 'Admin' || user.role === 'SuperAdmin';
  req.user = { userId: user.id, isAdmin };
  return next();
};

const isAuthorized = (req, res, next) => next();

export { isLoggedIn, isAuthorized };
