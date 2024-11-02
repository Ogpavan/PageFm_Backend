const mongoose = require('mongoose');

const writerBooksSchema = new mongoose.Schema({
  writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Writer's user ID
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Book ID
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('WriterBooks', writerBooksSchema);
