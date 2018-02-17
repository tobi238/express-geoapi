const h = require('../../helpers');

const shp = require('shpjs');

/* CONVERT
input: shapefile, optional: header with Accept-Encoding application-json to get geojson file
output: geojson
 */
module.exports = (req, res) => {
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
      h.logSuccess(false, req, `created (${readableFileSize})`);
      return res.json(geojson);
    }
    // add to zip file and stream as response
    h.logSuccess(false, req, `created (${readableFileSize}), bundling zip archive now...`);
    return h.zipResponse(res, 'test', 'geojson', JSON.stringify(geojson));
  }).catch(err => h.logError(res, req, err, 422, `error while converting shapefile (${readableFileSize})`));
};
