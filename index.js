// Check environment variables
if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').load();
}
if (!process.env.PORT) {
  process.env.PORT = 3000;
  console.warn('Environment Variable PORT is not set. Using default Port 3000.');
}

const express = require('express');
const bodyParser = require('body-parser');

const h = require('./helpers');

const db = require('./db');
const buffer = require('./routes/buffer');
const shpToGeojson = require('./routes/shpToGeojson');

const app = express();

// for parsing application/json
app.use(bodyParser.json());

// for parsing zip files as binary data
app.use(bodyParser.raw({
  type: 'application/zip',
  inflate: true,
  limit: '50mb',
}));

// handling errors
app.use((err, req, res, next) => {
  if (err) return h.logError(res, req, err, 400, 'invalid request data');
  next();
});


// HANDLE ROUTES

/*
Home URL
 */
app.get('/', (req, res) => h.logSuccess(res, req, 'api ready'));

/*
Test Postgres DB Connection
 */
app.get('/db/test', (req, res) => db.test(req, res));

/* BUFFER
input: geojson
output: buffered geojson
 */
app.get('/buffer', (req, res) => buffer(req, res));

/* CONVERT
input: shapefile, optional: header with Accept-Encoding application-json to get geojson file
output: geojson
 */
app.post('/convert', (req, res) => shpToGeojson(req, res));


app.listen(process.env.PORT, () => console.log(`geoapi is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));
