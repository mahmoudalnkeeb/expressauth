const { Router } = require('express');
const { status, signup, signin, signout } = require('../../controllers/auth.controllers');
const authMw = require('../../mws/auth.mw');
const authRouter = Router();

authRouter.head('/status', authMw, status);
authRouter.get('/signout', authMw, signout);
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);

module.exports = authRouter;
