// models/Career.js
const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  applicationLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Career', careerSchema);
