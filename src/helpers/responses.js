

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
