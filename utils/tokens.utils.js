const jwt = require('jsonwebtoken');

const blacklist = new Map();

function validateToken(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      audience: process.env.JWT_AUDIENCE.split(','),
      issuer: process.env.JWT_ISSUER,
    });
    const userId = decodedToken.user;
    if (blacklist.has(userId) && blacklist.get(userId).has(token)) return null;
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

const generateToken = (userID) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const audience = process.env.JWT_AUDIENCE.split(',');
  const options = { expiresIn: '1h', audience, issuer: process.env.JWT_ISSUER };

  return jwt.sign({ user: userID }, secretKey, options);
};

function blacklistToken(token, userId) {
  console.log(blacklist);

  if (!blacklist.has(userId)) {
    blacklist.set(userId, new Set());
  }
  const userTokens = blacklist.get(userId);
  try {
    userTokens.add(token);
    return true;
  } catch (error) {
    return false;
  }
}

function removeUserTokens(userID) {
  if (blacklist.has(userID)) {
    blacklist.delete(userID);
  }
}

module.exports = {
  validateToken,
  generateToken,
  blacklistToken,
  removeUserTokens,
};
