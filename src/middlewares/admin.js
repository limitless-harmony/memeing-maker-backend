import ApplicationError from '../helpers/Error';

const isAdmin = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return next(
      new ApplicationError('You must be logged in to access this!', 401)
    );
  }
  if (user.isAdmin) return next();
  return next(
    new ApplicationError("You don't have permission to access this", 403)
  );
};

export default isAdmin;
