const { Router } = require('express');
const apiRouter = require('./api');

const router = Router();
const apiVersion = +process.env.API_VERSION || 1;

console.log(`/api/${apiVersion}`)
router.use(`/api/v${apiVersion}`, apiRouter);

module.exports = router;
