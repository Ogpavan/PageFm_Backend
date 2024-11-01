const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Book = require('../models/Book');

// Create a new book
// Create a new book with an initial episode
router.post('/', async (req, res, next) => {
  try {
    const { title, description, coverImage, content, primaryGenre, genres, author, uid } = req.body;

    const newBook = new Book({
      title,
      description,
      coverImage,
      primaryGenre,
      genres,
      author,
      user: uid,
      reads: 0,
      episodes: [
        {
          title: `Introduction to ${title}`, // Use book title as base for episode title
          content: content, // Initial content for the first episode
          episodeNumber: 1,
          createdAt: new Date(),
        },
      ],
    });

    const savedBook = await newBook.save();
    res.status(201).json({ message: 'Book and Episode 1 created successfully', book: savedBook });
  } catch (error) {
    next(error);
  }
});



router.get('/genres', async (req, res, next) => {
  
  try {
    const genres = await Book.find().distinct('primaryGenre');
    res.json(genres);
  } catch (error) {
    next(error);
  }
  
  
  });

// Add an episode to an existing book
router.post('/:bookId/episodes', async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { title, content } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Set episode number based on existing episodes
    const episodeNumber = book.episodes.length + 1;

    const newEpisode = {
      title,
      content,
      episodeNumber,
      createdAt: new Date(),
    };

    book.episodes.push(newEpisode);
    await book.save();

    res.status(201).json({ message: 'Episode added successfully', episode: newEpisode });
  } catch (error) {
    next(error);
  }
});

// Get all books or filter by genre
router.get('/', async (req, res, next) => {
  try {
    const { primaryGenre } = req.query;
    const query = primaryGenre ? { primaryGenre } : {};
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Get a single book by ID and increment reads
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const book = await Book.findByIdAndUpdate(id, { $inc: { reads: 1 } }, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    res.json(book);
  } catch (error) {
    next(error);
  }
});

// Delete a book by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
});





module.exports = router;
