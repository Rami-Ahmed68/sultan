const mongoose = require("mongoose");

const work = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  images : [{
    type : String,
  }],
  video : [{
    type : String,
  }],
  link : {
    type : String,
    required : false
  },
  created_at : {
    type : String,
    required : true
  },
});

const Work = mongoose.model("work" , work);
module.exports = Work;