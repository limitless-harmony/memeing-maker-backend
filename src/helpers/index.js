import { Types } from 'mongoose';

export const trim = body => {
  const trimmed = {};
  // Removes empty spaces
  Object.entries(body).forEach(([key, value]) => {
    trimmed[key] = value.toString().trim();
  });
  return trimmed;
};

export const responseSuccess = async (code, data, message, res) =>
  res.status(code).json({
    status: 'success',
    data,
    message,
  });
export const checkRequired = (body, requiredFields) => {
  // Removes empty spaces
  const inputs = trim(body);
  const errors = {};
  let missingRequired = false;

  // Checks that all required fields are present
  requiredFields.forEach(element => {
    if (!(element in inputs)) {
      missingRequired = true;
      errors[element] = `${element} is required`;
    }
  });
  return { missingRequired, inputs, errors };
};

export const isValidId = id => Types.ObjectId.isValid(id);

export const sentenceCase = sentence =>
  `${sentence[0].toUpperCase()}${sentence.substr(1)}`;
