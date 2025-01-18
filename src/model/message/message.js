const mongoose = require("mongoose");

const message = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

const Message = mongoose.model("messaeg", message);
module.exports = Message;
