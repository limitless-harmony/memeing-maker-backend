import trim from './trim';

const checkRequired = (body, requiredFields) => {
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

export default checkRequired;
