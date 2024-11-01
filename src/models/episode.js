const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  episodeNumber: {
    type: Number,
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Episode', episodeSchema);
