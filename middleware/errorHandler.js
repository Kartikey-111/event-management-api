
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error Stack:', err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
    stack: process.env.NODE_ENV === 'production' ? '🥞 Hidden' : err.stack,
  });
};
