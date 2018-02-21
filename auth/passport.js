const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./user');
const h = require('../helpers');

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = Buffer.from(process.env.JWT_SECRET, 'base64');
  opts.ignoreExpiration = false;
  opts.issuer = `${process.env.HOST_NAME}:${process.env.PORT}`;
  passport.use(new JwtStrategy(opts, ((jwt_payload, next) => {
    User.find(jwt_payload.username).then((user) => {
      if (user) {
        if(user.plan === jwt_payload.plan) {
          console.log(h.FgMagenta, `🔓  valid token: username: ${user.username}, plan: ${user.plan}`);
          return next(null, user);
        } else {
          console.log(h.FgYellow, `🔒  invalid token: user '${user.username}' is not in '${user.plan}' plan`);
          return next(null, false);
        }
      }
      console.log(h.FgYellow, `🔒  invalid token: user '${jwt_payload.username}' does not exist`);
      return next(null, false);
    });
  })));
};
