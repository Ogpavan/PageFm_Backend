// routes/careers.js
const express = require('express');
const Career = require('../models/career');

const router = express.Router();

// Fetch all career vacancies
router.get('/', async (req, res) => {
  try {
    const careers = await Career.find();
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching careers' });
  }
});

// Post a new career vacancy (requires auth)
router.post('/new', async (req, res) => {
  const { title, description, applicationLink } = req.body;
  try {
    const newCareer = new Career({ title, description, applicationLink });
    await newCareer.save();
    res.status(201).json(newCareer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new career vacancy' });
  }
});

// Delete a career vacancy by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCareer = await Career.findByIdAndDelete(id);
    
    if (!deletedCareer) {
      return res.status(404).json({ message: 'Career not found' });
    }

    res.status(200).json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({ message: 'Server error. Unable to delete career.' });
  }
});

module.exports = router;
