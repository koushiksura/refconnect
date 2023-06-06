const mongoose = require("mongoose");

const PatronSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone_number: {
    type: String,
    maxlength: 11,
  },

  address: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
});

const Patron = mongoose.model("Patron", PatronSchema);

module.exports = Patron;
