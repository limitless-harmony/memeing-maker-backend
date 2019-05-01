import { checkRequired, responseError } from '../helpers';

export const validateMeme = (req, res, next) => {
  const requiredFields = ['image'];
  const { missingRequired, inputs, errors } = checkRequired(req.body, requiredFields);

  if (missingRequired) return responseError(400, errors, 'Bad request', res);
  req.body = inputs;
  next();
};

export const validateUser = (req, res, next) => {

};
