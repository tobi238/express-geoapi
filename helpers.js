const archiver = require('archiver');

// console log colors ✨
module.exports.Reset = '\x1b[0m';
module.exports.Bright = '\x1b[1m';
module.exports.Dim = '\x1b[2m';
module.exports.Underscore = '\x1b[4m';
module.exports.Blink = '\x1b[5m';
module.exports.Reverse = '\x1b[7m';
module.exports.Hidden = '\x1b[8m';

module.exports.FgBlack = '\x1b[30m';
module.exports.FgRed = '\x1b[31m';
module.exports.FgGreen = '\x1b[32m';
module.exports.FgYellow = '\x1b[33m';
module.exports.FgBlue = '\x1b[34m';
module.exports.FgMagenta = '\x1b[35m';
module.exports.FgCyan = '\x1b[36m';
module.exports.FgWhite = '\x1b[37m';

module.exports.BgBlack = '\x1b[40m';
module.exports.BgRed = '\x1b[41m';
module.exports.BgGreen = '\x1b[42m';
module.exports.BgYellow = '\x1b[43m';
module.exports.BgBlue = '\x1b[44m';
module.exports.BgMagenta = '\x1b[45m';
module.exports.BgCyan = '\x1b[46m';
module.exports.BgWhite = '\x1b[47m';

module.exports.logError = (res, req, err, status, message) => {
  console.error(this.FgRed, `❌ ${req.url || ''} ${message}: ${err.message || err}`);
  return res.status(status).json({
    status: false,
    message,
  });
};

module.exports.logSuccess = (res, req, message) => {
  console.log(this.FgGreen, `✅ ${req.url || ''} ${message}`);
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
