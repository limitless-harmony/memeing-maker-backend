import { sentenceCase } from '.';

export default {
  notFound: model => `Oops, looks like this ${model} does not exist!`,
  empty: model => `Oops, looks like no ${model} is available yet!`,
  forbidden: () => 'Oops, looks like you are not allowed to do this',
  unAuthenticated: () => 'Please login first!',
  badDataType: (field, type) => sentenceCase(`${field} must be a ${type}`),
  invalidField: (model, field) => `Please provide a valid ${model} ${field}`,

  success: (model, action) =>
    `Awesome! You have successfully ${action} the ${model}`,
};
