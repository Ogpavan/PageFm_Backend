// index.js (Main entry point)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();

// Import Routes
const bookRoutes = require('./src/routes/books');
const writerRoutes = require('./src/routes/writers');
const topReadsRoutes = require('./src/routes/topReads');
const careerRoutes = require('./src/routes/careers');
const bookSummaryRoutes = require('./src/routes/book_home'); // New topReads route

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI )
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Register Routes
app.use('/api/book-home', bookSummaryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/writers', writerRoutes);
app.use('/api/top-reads', topReadsRoutes); // New topReads route
app.use('/api/careers', careerRoutes);

// Image Upload Route (Cloudinary)
const { storage } = require('./src/config/cloudinary');
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Home Route
app.get('/', (req, res) => res.send('Hello World!'));

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
