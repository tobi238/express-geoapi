const archiver = require('archiver');

module.exports.logError = (res, req, err, status, message) => {
  console.error(`${req.url} ${message}: ${err.message || err}`);
  return res.status(status).json({
    status: false,
    message,
  });
};

module.exports.logSuccess = (res, req, message) => {
  console.log(`${req.url} ${message}`);
  if (res) {
    return res.json({
      status: true,
      message,
    });
  }
};

module.exports.fileSize = (a, b, c, d, e) => `${(b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2)} ${e ? `${'kMGTPEZY'[--e]}B` : 'Bytes'}`;


module.exports.zipResponse = (res, fileName, fileExtension, fileData) => {
  const archive = archiver('zip');

  // error creating archive
  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });
  // archive created
  archive.on('close', () => res.status(200).send('OK').end());

  // stream data to archive
  res.attachment(`${fileName}.zip`);
  archive.pipe(res);
  archive.append(fileData, { name: `${fileName}.${fileExtension}` });
  archive.finalize();
};
