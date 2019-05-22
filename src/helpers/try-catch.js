const tryCatch = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    throw error;
  }
};

export default tryCatch;
