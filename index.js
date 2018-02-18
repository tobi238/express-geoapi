const dotenv = require('dotenv');

const result = dotenv.config();

// parse .env file
if (result.error) {
  console.error('failed to load .env file', result.error.message);
  process.exit(1);
} else {
  console.log('environment variables found');
}

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./auth/passport')(passport);
const jwt = require('./auth/jwt');
const helmet = require('helmet');
const cors = require('cors');

const User = require('./auth/user');

const h = require('./helpers');
const CustomError = require('./customErrors');


const db = require('./db');
const buffer = require('./routes/buffer');
const shpToGeojson = require('./routes/convert/shpToGeojson');


// define express app
const app = express();

// secure headers
app.use(helmet());

// CORS allow origins
const whitelist = process.env.ALLOWED_ORIGINS.split(',');
console.info('CORS allowed origins:', whitelist);
const corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Host');
  if (whitelist.indexOf(origin) !== -1) {
    callback(null, { origin: true });
  } else {
    callback(new CustomError(`origin ${origin} not allowed`, 'origin-not-allowed'), { origin: false });
  }
};
app.use(cors(corsOptionsDelegate));

// for parsing application/json
app.use(bodyParser.json());

// for parsing zip files as binary data
app.use(bodyParser.raw({
  type: 'application/zip',
  inflate: true,
  limit: '50mb',
}));

// passport security
app.use(passport.initialize());


// handling errors
app.use((err, req, res, next) => {
  // check if it was a CustomError
  if (err && err.extra) return h.logError(res, req, err, 400, `invalid request (${err.extra})`);
  if (err) return h.logError(res, req, err, 400, 'invalid request');
});

// HANDLE ROUTES

/* API Home */
app.get('/', (req, res) => h.logSuccess(res, req, 'api ready'));
/* API available URLs */
app.get('/db/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  // check if authenticated user has a premium plan
  User.isPremium(req.user.username)
    .then(() => db.test(req, res))
    .catch(err => h.logError(res, req, err.extra, 401, err.message));
});

app.get('/buffer', passport.authenticate('jwt', { session: false }), (req, res) => buffer(req, res));
app.post('/convert/shp-to-geojson', passport.authenticate('jwt', { session: false }), (req, res) => shpToGeojson(req, res));


// passport signup
app.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    h.logError(res, req, `username: ${req.body.username || 'missing'}, password: ${req.body.password || 'missing'}`, 401, 'please pass username and password');
  } else {
    // save the user
    User.create(req.body.username, req.body.password)
      .then(() => h.logSuccess(res, req, `user '${req.body.username}' created`))
      .catch(err => h.logError(res, req, false, 400, err.message));
  }
});

// passport signin
app.post('/signin', (req, res) => {
  User.find(req.body.username)
    .then((user) => {
      if (!user) return h.logError(res, req, false, 401, `user '${req.body.username}' not found`);
      // check if password matches
      User.comparePassword(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          // if user is found and password is right create a token
          const token = jwt.createToken(req, user);
          // return the information including token as JSON
          res.json({ success: true, token: `${token}` });
        } else {
          res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    });
});

// disallow indexing by bots
app.get('/robots.txt', (req, res) => {
  res.set({'Content-Type': 'text/plain'});
  res.send('User-agent: *\nDisallow: /');
});

// handling non existing routes
app.get('*', (req, res) => {
  res.redirect('/');
});


// start server
app.listen(process.env.PORT, process.env.HOST_NAME, () => console.log(h.FgBlue, `🌍 geoapi is running in ${process.env.NODE_ENV} mode on ${process.env.HOST_NAME}:${process.env.PORT}`));

// test db connection on startup
db.test().then(() => {}).catch(() => {});
