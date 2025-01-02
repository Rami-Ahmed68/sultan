const mongoose = require("mongoose");

const skill = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
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
