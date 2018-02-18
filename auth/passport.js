const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./user');

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = Buffer.from(process.env.JWT_SECRET, 'base64');
  opts.ignoreExpiration = false;
  opts.issuer = `${process.env.HOST_NAME}:${process.env.PORT}`;
  passport.use(new JwtStrategy(opts, ((jwt_payload, done) => {
    User.find(jwt_payload.username).then((user) => {
      if (user) return done(null, user);
      return done(null, false);
    });
  })));
};
