import { Types } from 'mongoose';

export const trim = (body) => {
  const trimmed = {};
  // Removes empty spaces
  Object.entries(body).forEach(([key, value]) => {
    trimmed[key] = value.toString().trim();
  });
  return trimmed;
};

export const responseError = (code, error, message, res) => res.status(code).json({
  code,
  error,
  message
});

export const responseSuccess = (code, data, message, res) => res.status(code).json({
  code,
  data,
  message
});

export const checkRequired = (body, requiredFields) => {
  // Removes empty spaces
  const inputs = trim(body);
  const errors = {};
  let missingRequired = false;

  // Checks that all required fields are present
  requiredFields.forEach((element) => {
    if (!(element in inputs)) {
      missingRequired = true;
      errors[element] = `${element} is required`;
    }
  });
  return { missingRequired, inputs, errors };
};

export const isValidId = id => Types.ObjectId.isValid(id);
