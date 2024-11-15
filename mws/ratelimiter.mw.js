const requests = new Map();
const interval = 60000;

setInterval(() => {
  requests.clear();
}, interval);

module.exports = (limit = 100) => {
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip);

    const timeWindowStart = currentTime - interval;
    const filteredTimestamps = timestamps.filter((timestamp) => timestamp > timeWindowStart);

    filteredTimestamps.push(currentTime);
    requests.set(ip, filteredTimestamps);

    if (filteredTimestamps.length > limit) {
      return res.status(429).json({
        code: 429,
        status: 'Error',
        message: 'Rate limit exceeded.',
        data: {
          limit,
          remaining: 0,
          resetTime: new Date(currentTime + interval).toISOString(),
        },
      });
    }


    req.setTimeout(15000, () => {
      res.status(504).json({
        code: 504,
        status: 'Error',
        message: 'Gateway timeout.',
        data: null,
      });
      req.abort();
    });

    next();
  };
};
