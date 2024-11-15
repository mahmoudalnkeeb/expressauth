const { Router } = require('express');
const authRouter = require('./auth.routes');

const apiRouter = Router();
const apiVersion = +process.env.API_VERSION || 1;

apiRouter.get('/', (req, res) => {
  res.send(`API version ${apiVersion}`);
});
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
