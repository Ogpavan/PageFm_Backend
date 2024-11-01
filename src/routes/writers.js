const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books by a writer
router.get('/:uid/books', async (req, res, next) => {
  try {
    const books = await Book.find({ user: req.params.uid });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Get writer details (first book found)
router.get('/:uid', async (req, res, next) => {
  try {
    const writer = await Book.findOne({ user: req.params.uid });
    if (!writer) return res.status(404).json({ error: 'Writer not found' });
    res.json(writer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
