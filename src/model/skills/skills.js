const mongoose = require("mongoose");

const skill = new mongoose.Schema({
  english_title: {
    type: String,
    required: true,
  },
  arabic_title: {
    type: String,
    required: true,
  },
  english_description: {
    type: String,
  },
  arabic_description: {
    type: String,
  },
  icon: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Skill = mongoose.model("skill", skill);

module.exports = Skill;
