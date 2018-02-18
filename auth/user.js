const db = require('../db');
const bcrypt = require('bcrypt');

module.exports.create = async (username, password) => {
  const userExists = await this.find(username);
  if (userExists) throw { message: `user '${username}' already exists` };
  else {
    return bcrypt.hash(password, 10).then(hash => db.con.none('INSERT INTO public.user(username, password) VALUES($[username], $[password])', {
      username,
      password: hash,
    }));
  }
};

module.exports.find = username => db.con.one('SELECT * FROM public.user WHERE username=$[username]', {
  username,
}).then(data => data).catch(() => false);


module.exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);
