const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number, // Sequential number of the episode
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Content of the episode
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String, // URL to the image stored in Cloudinary
    required: true,
  },
  primaryGenre: {
    type: String,
    required: true,
  },
  genres: {
    type: [String], // Array of genres
    default: [],
  },
  author: {
    type: String, // Firebase UID as String
    required: true,
  },
  reads: {
    type: Number,
    default: 0,
  },
  episodes: [episodeSchema], // Embedded episodes schema
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` on book update
bookSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const book = mongoose.models.Book || mongoose.model('Book', bookSchema);

module.exports = book;
