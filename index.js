const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');
const shp = require('shpjs');

const h = require('./helpers');


const app = express();

// for parsing application/json
app.use(bodyParser.json());

// for parsing zip files as binary data
app.use(bodyParser.raw({
  type: 'application/zip',
  inflate: true,
  limit: '100mb',
}));

// handling errors
app.use((err, req, res, next) => {
  if (err) return h.logError(res, req, err, 400, 'invalid request data');
  next();
});


app.get('/', (req, res) => {
  h.logSuccess(req, 'API Base URL hit');
  return res.send('Homepage!');
});


/* BUFFER
input: geojson
output: buffered geojson
 */
app.get('/buffer', (req, res) => {
  try {
    const {
      geojson,
      radius = 100,
    } = req.body;

    // set default options
    const options = {
      units: 'kilometres',
      steps: 64,
    };
    // check if nested options are set in request
    if (req.body.options && req.body.options.units) options.units = req.body.options.units;
    if (req.body.options && req.body.options.steps) options.steps = req.body.options.steps;

    const bufferedGeojson = turf.buffer(geojson, radius, options);

    h.logSuccess(req, `created with radius ${radius} ${options.units} and ${options.steps} steps`);
    return res.json(bufferedGeojson);
  } catch (err) {
    console.log(err);
    return h.logError(res, req, err, 422, 'error while processing data');
  }
});

/* CONVERT
input: shapefile
output: geojson
 */
app.post('/convert', (req, res) => {
  const fileSize = h.fileSize(req.body.byteLength);
  shp(req.body)
    .then((geojson) => {
      h.logSuccess(req, `created geojson from shapefile (${fileSize})`);
      res.json(geojson);
    })
    .catch(err => h.logError(res, req, err, 422, `error while converting shapefile (${fileSize})`));
});


app.listen(3000, () => console.log('geoapi is running'));
