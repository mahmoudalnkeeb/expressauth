const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN || '*',
  })
);
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

const ratelimiterMw = require('./mws/ratelimiter.mw');
const notfoundMw = require('./mws/notfound.mw');
const errorMw = require('./mws/error.mw');

app.use(ratelimiterMw(100));

const router = require('./routes');
app.use(router);

app.use(notfoundMw);
app.use(errorMw);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
