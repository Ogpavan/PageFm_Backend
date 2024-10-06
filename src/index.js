const express = require('express');

const cors = require('cors');
// require('dotenv').config();
// const writersbooks = require('./models/writersbooks.js');

// const app = express();

app.use(cors({
  origin: '*',  // Allow all origins temporarily for testing
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


module.exports = app;  // Ensure the app is exported for Vercel
