const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Book = require('../models/Book');
const BookSummary = require('../models/BookSummary');
const { cloudinary } = require('../config/cloudinary');

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
// Get all books or filter by genre and writer
router.get('/', async (req, res, next) => {
  try {
    const { primaryGenre, writerId } = req.query;
    const query = { ...(primaryGenre && { primaryGenre }), ...(writerId && { user: writerId }) };
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    next(error);
  }
});



// Fetch books for a specific writer by UID
router.get('/existingbooks', async (req, res, next) => {
  try {
    const { userId } = req.query;

    // Check if userId (Firebase UID) is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find books where `user` matches the Firebase UID
    const books = await Book.find({ user: userId });

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

    // Increment reads in Book and get updated book
    const book = await Book.findByIdAndUpdate(id, { $inc: { reads: 1 } }, { new: true });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Update the BookSummary readsCount
    const bookSummary = await BookSummary.findOne({ book: id });
    if (bookSummary) {
      await bookSummary.incrementReads(); // Increment readsCount in BookSummary
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
});


// Update an episode for a specific book
router.put('/:bookId/episodes/:episodeId', async (req, res, next) => {
  try {
    const { bookId, episodeId } = req.params;
    const { title, content } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(bookId) || !mongoose.Types.ObjectId.isValid(episodeId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const episode = book.episodes.id(episodeId);
    if (!episode) return res.status(404).json({ error: 'Episode not found' });

    // Update episode details
    episode.title = title;
    episode.content = content;
    await book.save();

    res.json({ message: 'Episode updated successfully', episode });
  } catch (error) {
    next(error);
  }
});

// Get a specific episode of a specific book
router.get('/:bookId/episodes/:episodeId', async (req, res, next) => {
  try {
    const { bookId, episodeId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(bookId) || !mongoose.Types.ObjectId.isValid(episodeId)) {
      return res.status(400).json({ error: 'Invalid book ID or episode ID' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Find the episode by ID
    const episode = book.episodes.id(episodeId);
    if (!episode) return res.status(404).json({ error: 'Episode not found' });

    res.json(episode);
  } catch (error) {
    next(error);
  }
});

 


// Delete a book by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the book by ID
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Extract the publicId from the coverImage URL for Cloudinary deletion
    const coverImageUrl = book.coverImage;
    const publicId = coverImageUrl.split('/').slice(-2).join('/').split('.')[0]; // Extracts 'bookify/dk2bv4wujbj1vynclfdy'

    // Delete the cover image from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
 // Log Cloudinary response

    // Delete the associated BookSummary entry
    const bookSummary = await BookSummary.findOneAndDelete({ book: id });
  

    res.json({ message: 'Book, summary, and cover image deleted successfully' });
  } catch (error) {
    console.error('Error in delete route:', error);
    next(error);
  }
});




module.exports = router;
