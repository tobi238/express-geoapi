const express = require('express');
const fs = require('fs');
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
  limit: '50mb',
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
input: shapefile, optional: header with Accept-Encoding application-json to get geojson file
output: geojson
 */
app.post('/convert', (req, res) => {
  const fileSize = req.body.byteLength;
  const readableFileSize = h.fileSize(fileSize);
  if (fileSize > 5e7) {
    const errorMessage = `file larger than 50Mb (${readableFileSize})`;
    return h.logError(res, req, errorMessage, 413, errorMessage);
  }

  shp(req.body).then((geojson) => {
    // check header for accept-encoding
    // only if it is set to json return geojson directly
    // else zip the response
    const acceptEncoding = req.get('accept-encoding');
    if (acceptEncoding && acceptEncoding === 'application/json') {
      h.logSuccess(req, `created geojson from shapefile (${readableFileSize})`);
      return res.json(geojson);
    }
    // add to zip file and stream as response
    h.logSuccess(req, `created geojson from shapefile (${readableFileSize}), creating zip archive now...`);
    return h.zipResponse(res, 'test', 'geojson', JSON.stringify(geojson));
  }).catch(err => h.logError(res, req, err, 422, `error while converting shapefile (${readableFileSize})`));
});


app.listen(3000, () => console.log('geoapi is running'));
