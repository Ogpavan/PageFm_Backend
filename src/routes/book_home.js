// src/routes/bookSummary.js
const express = require('express');
const BookSummary = require('../models/BookSummary');
const router = express.Router();

// Get all book summaries for the homepage
router.get('/', async (req, res) => {
  try {
    const summaries = await BookSummary.find();
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book summaries' });
  }
});

module.exports = router;
