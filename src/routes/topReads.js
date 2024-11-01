// src/routes/topReads.js
const express = require('express');
const Book = require('../models/Book'); // Assuming you have a Book model
const router = express.Router();

// Route to get the most popular reads
router.get('/', async (req, res) => {
  try {
    // Fetch books sorted by 'reads' in descending order, limited to top 10
    const topReads = await Book.find().sort({ reads: -1 }).limit(10);
    res.json(topReads);
  } catch (error) {
    console.error('Failed to fetch top reads:', error.message);
    res.status(500).json({ error: 'Failed to fetch top reads' });
  }
});

module.exports = router;
