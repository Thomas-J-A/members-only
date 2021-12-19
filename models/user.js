const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  imageURL: { type: String },
  isMember: { type: Boolean, required: true },
  isAdmin: { type: Boolean, required: true },
});

// Export model
module.exports = mongoose.model('User', userSchema);
