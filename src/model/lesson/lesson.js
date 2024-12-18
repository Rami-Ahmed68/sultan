const mongoose = require("mongoose");

const lesson = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  program : {
    type : String,
    required : true
  },
  images : [{
    type : String,
  }],
  created_at : {
    type : String,
    required : true
  },
});

const Lesson = mongoose.model("lesson" , lesson);
module.exports = Lesson;