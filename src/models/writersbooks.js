const mongoose = require('mongoose');

const writersBooksSchema = new mongoose.Schema({
  writerId: { type: String, required: true }, 
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
    required: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },
});

// Create the Mongoose model based on the schema
const writersbooks = mongoose.model('WritersBooks', writersBooksSchema);

// Export the model to be used in other parts of the application
module.exports = writersbooks;
