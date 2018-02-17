const h = require('./helpers.js');

const initOptions = {};
const pgp = require('pg-promise')(initOptions);

// Database connection details
const con = {
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: process.env.DB_PORT ? process.env.DB_PORT : 5432,
  database: process.env.DB_NAME ? process.env.DB_NAME : 'dbname',
  user: process.env.DB_USER ? process.env.DB_USER : 'username',
  password: process.env.DB_PWD ? process.env.DB_PWD : 'password',
};

const db = pgp(con);

const connect = () => db.connect()
  .then((obj) => {
    console.log('connected to db', obj);
    obj.done(); // success, release the connection;
  }).catch(error => console.log('ERROR:', error.message || error));

module.exports.test = async (req, res) => {
  try {
    const data = await db.any('SELECT * FROM test WHERE id=$[id]', {
      id: 1,
    });
    return h.logSuccess(res, req, 'connection test success');
  } catch (err) {
    return h.logError(res, req, err, 503, 'connection test error');
  }
};
