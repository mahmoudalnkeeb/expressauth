const { validateToken } = require('../utils/tokens.utils');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    // try catch to handle invalid token
    try {
      decodedToken = validateToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // check if user has any of required roles
    if (roles.length != 0 && !roles.includes(decodedToken.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    req.auth = decodedToken;
    next();
  };
};
