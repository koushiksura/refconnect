const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },
  phone_number: {
    type: String,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      lowercase: true,
    },
    locality: {
      type: String,
      lowercase: true,
    },
    city: {
      type: String,
      lowercase: true,
    },
    zip: {
      type: Number,
      maxlength: 7,
    },
  },
});

const NgoUser = mongoose.model("NgoUser", UserSchema);

module.exports = NgoUser;
