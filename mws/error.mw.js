module.exports = (err, _req, res, _next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).json({
      code: 500,
      status: 'Error',
      message: err.message || 'Internal Server Error',
    });
  }
};
