const turf = require('@turf/turf');
const h = require('../helpers');

module.exports = (req, res) => {
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

    h.logSuccess(false, req, `created with radius ${radius} ${options.units} and ${options.steps} steps`);
    return res.json(bufferedGeojson);
  } catch (err) {
    return h.logError(res, req, err, 422, 'error while processing data');
  }
};
