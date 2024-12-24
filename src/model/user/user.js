const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  links: [
    {
      type: Object,
      title: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
  ],
  cv: {
    type: String,
  },
});

const User = mongoose.model("user", user);
module.exports = User;
