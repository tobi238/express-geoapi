const jwt = require('jsonwebtoken');

module.exports.createToken = (req, user) => jwt.sign({
  username: user.username,
  plan: user.plan || 'free',
  iss: req.headers.host,
}, Buffer.from(process.env.JWT_SECRET, 'base64'), { expiresIn: process.env.JWT_EXP || '1h' });
