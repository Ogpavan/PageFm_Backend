const mongoose = require('mongoose');

const writersBooksSchema = new mongoose.Schema({
  writerId: { type: String, required: true }, // Firebase UID of the writer
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
    required: true,
  },
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series', // Optional reference to the Series model
  },
  episodeNumber: {
    type: Number, // Optional: Episode order in the series
  },
  publishedAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

// Create the Mongoose model
const WritersBooks = mongoose.model('WritersBooks', writersBooksSchema);

// Export the model for use in other parts of the application
module.exports = WritersBooks;
 