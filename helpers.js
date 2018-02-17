module.exports.logError = (res, req, err, status, message) => {
  console.log(`${req.url} ${message}: ${err.message}`);
  return res.status(status).json({
    status: false,
    message,
  });
};

module.exports.logSuccess = (req, message) => {
  console.log(`${req.url} ${message}`);
};

module.exports.fileSize = (a, b, c, d, e) => `${(b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2)} ${e ? `${'kMGTPEZY'[--e]}B` : 'Bytes'}`;
