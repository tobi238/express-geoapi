const h = require('./helpers.js');

const initOptions = {};
const pgp = require('pg-promise')(initOptions);

// Database connection settings
const settings = {
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: process.env.DB_PORT ? process.env.DB_PORT : 5432,
  database: process.env.DB_NAME ? process.env.DB_NAME : 'dbname',
  user: process.env.DB_USER ? process.env.DB_USER : 'username',
  password: process.env.DB_PWD ? process.env.DB_PWD : 'password',
};

module.exports.con = pgp(settings);

/*
Test Postgres DB Connection
 */
module.exports.test = async (req = false, res = false) => {
  try {
    const data = await this.con.any('SELECT * FROM test WHERE id=$[id]', {
      id: 1,
    });
    return h.logSuccess(
      res,
      req,
      res
        ? 'connected to DB'
        : `connected to postgresql server on ${process.env.DB_HOST}:${process.env.DB_PORT}/${
          process.env.DB_NAME
        } with user ${process.env.DB_USER}`,
    );
  } catch (err) {
    return h.logError(res, req, err, 503, 'DB connection error');
  }
};
