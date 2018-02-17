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
