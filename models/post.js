const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

// Export model
module.exports = mongoose.model('Post', postSchema);
