const { validateToken } = require('../utils/tokens.utils');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = validateToken(token);
    if (roles.length != 0 && !roles.includes(decodedToken.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    if (!decodedToken) {
      req.auth = null;
      next();
      return;
    }
    req.auth = decodedToken;
    next();
  };
};
