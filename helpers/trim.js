
const trim = (body) => {
  const trimmed = {};
  // Removes empty spaces
  Object.entries(body).forEach(([key, value]) => {
    trimmed[key] = value.toString().trim();
  });
  return trimmed;
};

export default trim;
