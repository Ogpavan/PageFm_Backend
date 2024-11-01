const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: String, // Store Firebase UID as a string directly
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Series = mongoose.models.Series || mongoose.model('Series', seriesSchema);

module.exports = Series;
