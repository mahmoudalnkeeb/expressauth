const { validateToken } = require('../utils/tokens.utils');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decodedToken = validateToken(token);
  if (!decodedToken) {
    req.auth = null;
    next();
    return;
  }
  req.auth = decodedToken;
  next();
};
