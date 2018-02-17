const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');

const h = require('./helpers');


const app = express();

// for parsing application/json
app.use(bodyParser.json());

// handling errors
app.use((err, req, res, next) => {
  if (err) return h.logError(res, req, err, 400, 'invalid request data');
  next();
});


app.get('/', (req, res) => {
  h.logSuccess(req, 'API Base URL hit');
  return res.send('Homepage!');
});

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


app.listen(3000, () => console.log('geoapi is running'));
