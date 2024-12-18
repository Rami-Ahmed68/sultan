const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path : "../../../config/.env"  });

// hashing password method
const hash = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  return (password = bcrypt.hash(password , salt));
};

module.exports = hash;