const mongoose = require('mongoose');
const BookSummary = require('./BookSummary');

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
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
    type: String,
    required: true,
  },
  primaryGenre: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    default: [],
  },
  author: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  reads: {
    type: Number,
    default: 0,
  },
  episodes: [episodeSchema],
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

// Method to increment reads and synchronize with BookSummary
bookSchema.methods.incrementReads = async function() {
  this.reads += 1;
  await this.save();

  // Update or create the BookSummary record to reflect new readsCount
  await BookSummary.updateOne(
    { book: this._id },
    { $set: { readsCount: this.reads } },
    { upsert: true } // Creates the document if it doesn't exist
  );
};

// Post-save middleware to create a BookSummary if it doesn't already exist
bookSchema.post('save', async function (doc, next) {
  try {
    // Check if a BookSummary already exists for this book
    const existingSummary = await BookSummary.findOne({ book: doc._id });
    if (!existingSummary) {
      // Create a summary for the new book with essential fields
      await BookSummary.create({
        book: doc._id,
        name: doc.title,
        description: doc.description.substring(0, 30), // Store a shorter description
        readsCount: doc.reads,
        primaryGenre: doc.primaryGenre,
        coverImage: doc.coverImage,
        createdAt: doc.createdAt,
      });
      console.log(`Book summary created for: ${doc.title}`);
    }
    next();
  } catch (error) {
    console.error('Failed to create book summary:', error);
    next(error);
  }
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

module.exports = Book;
