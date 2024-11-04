// populateSummaries.js
const mongoose = require('mongoose');
const Book = require('./src/models/Book');
const BookSummary = require('./src/models/BookSummary');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const books = await Book.find();
    
    for (const book of books) {
      // Check if a summary already exists to avoid duplicates
      const existingSummary = await BookSummary.findOne({ book: book._id });
      if (!existingSummary) {
        await BookSummary.create({
          book: book._id,
          name: book.title,
          description: book.description.substring(0, 30), // Store shortened description
          readsCount: book.reads,
          primaryGenre: book.primaryGenre,
          coverImage: book.coverImage,
          createdAt: book.createdAt, // Optional, if you want to keep original timestamps
        });
        console.log(`Summary created for book: ${book.title}`);
      }
    }

    console.log('Summaries populated successfully');
    mongoose.connection.close();
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));
