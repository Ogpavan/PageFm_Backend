const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const writersbooks = require('./models/writersbooks.js');

const app = express();

app.use(cors({
  origin: '*',  // Allow all origins temporarily for testing
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define your routes...

// app.listen(3000, () => {
//   console.log(`Server is running on port 3000`);
// });

module.exports = app;  // Ensure the app is exported for Vercel
