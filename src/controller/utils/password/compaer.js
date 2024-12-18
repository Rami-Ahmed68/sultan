const bcrypt = require("bcrypt");

// compare password method
const compare = (current_password , new_password) => {
  return bcrypt.compare(current_password , new_password);
};

module.exports = compare;