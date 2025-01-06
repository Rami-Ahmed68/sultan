const mongoose = require("mongoose");

const user = new mongoose.Schema({
  english_name: {
    type: String,
    required: true,
  },
  english_name: {
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
  english_description: {
    type: String,
    required: true,
  },
  english_description: {
    type: String,
    required: true,
  },
  english_bio: {
    type: String,
    required: true,
  },
  english_bio: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  telegram: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
    required: true,
  },
  instgram: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    required: true,
  },
  behance: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  cv: {
    type: String,
  },
  // this filed is just to show or hidde
  skills_page_status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = mongoose.model("user", user);
module.exports = User;
