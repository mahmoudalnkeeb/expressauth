const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validateToken, generateToken, blacklistToken, removeUserTokens } = require('../utils/tokens.utils');

const userDb = new User();

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const existingUser = await userDb.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userDb.create({ name, email, password: hashedPassword, salt });
    const token = generateToken(newUser.id);

    res.status(201).json({ message: 'User  created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user.' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await userDb.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);
    res.status(200).json({ message: 'Signed in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing in.' });
  }
};

exports.signout = (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    res.status(401).json({
      message: 'Invalid or expired token. You are not logged in.',
    });
    return;
  }
  const authData = req.auth;
  if (!authData) {
    res.status(401).json({
      message: 'Invalid or expired token. You are not logged in.',
    });
    return;
  }

  const isBlacklisted = blacklistToken(token, authData.user);
  if (!isBlacklisted) {
    res.status(500).json({
      message: 'An error occurred while signing out.',
    });
    return;
  }

  res.status(200).json({
    message: 'Signed out successfully.',
  });
};

exports.status = (req, res) => {
  const authData = req.auth;

  if (authData) {
    req.user = authData;
    res.setHeader('Authorization-Status', 'Valid').status(200).end();
  } else {
    res.setHeader('Authorization-Status', 'Invalid').status(401).end();
  }
};
