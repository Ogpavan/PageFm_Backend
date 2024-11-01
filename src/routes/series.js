const express = require('express');
const router = express.Router();
const Series = require('../models/series');
const Book = require('../models/Book');

// Get all series
router.get('/', async (req, res, next) => {
  try {
    const seriesList = await Series.find().select('_id name');
    res.json(seriesList);
  } catch (error) {
    next(error);
  }
});

// Get a series by ID
router.get('/:id', async (req, res, next) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ message: 'Series not found' });
    res.json(series);
  } catch (error) {
    next(error);
  }
});

// Get episodes by series ID
router.get('/:seriesId/episodes', async (req, res, next) => {
  try {
    const episodes = await Book.find({ seriesId: req.params.seriesId });
    if (!episodes.length) return res.status(404).json({ message: 'No episodes found' });

    // Optionally format the response
    const formattedEpisodes = episodes.map(episode => ({
      _id: episode._id,
      title: episode.title,
      episodeNumber: episode.episodeNumber,
      createdAt: episode.createdAt,
    }));

    res.json(formattedEpisodes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
