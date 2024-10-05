const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const writersbooks = require('../src/models/writersbooks.js'); 
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);






const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  coverImage: String,
  content: String,
  author: String, // Writer's name
  user: String, // Firebase user ID
  primaryGenre: String,
  genres: [String],
  reads: { type: Number, default: 0 },
});


const Book = mongoose.model('Book', bookSchema);

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookify',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
});


app.post('/api/books', async (req, res) => {
  try {
    const { title, description, coverImage, content, primaryGenre, genres, author, uid } = req.body;

    // Create and save the new book
    const newBook = new Book({
      title,
      description,
      coverImage,
      content,
      primaryGenre,
      genres,
      author,
      user: uid, // Assuming 'uid' is the writerId from Firebase Auth
    });

    const savedBook = await newBook.save();

    // Add the writer-book relationship to the writersBooks collection
    const writerBook = new writersbooks({
      writerId: uid, // Writer's ID (Firebase Auth User ID)
      bookId: savedBook._id, // The ID of the newly created book
    });

    await writerBook.save(); // Save the relationship in the new collection

    res.status(201).json(savedBook); // Respond with the saved book

  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ error: 'Failed to add book' });
  }
});



app.get('/api/books', async (req, res) => {
  try {
    const { primaryGenre } = req.query;
    let query = {};

    if (primaryGenre) {
      query.primaryGenre = primaryGenre; // Filter by primaryGenre
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the book by ID and increment the reads field by 1
    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { reads: 1 } }, // Increment reads by 1
      { new: true } // Return the updated document
    );
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});


//top-reads
app.get('/api/top-reads', async (req, res) => {
  try {
    // Fetch top 5 books sorted by reads in descending order
    const topBooks = await Book.find().sort({ reads: -1 }).limit(5); 
    res.status(200).json(topBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top reads' });
  }
});


//writers
app.get('/api/writers/:uid/books', async (req, res) => {
  try {
    const { uid } = req.params;
    const books = await Book.find({ user: uid }); // Use uid here
    // Log the books to check the output
   // For debugging
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch writer’s books' });
  }
});


app.get('/api/writers/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const writer = await Book.findOne({ user: uid }); // Adjust this query based on your needs
    if (!writer) return res.status(404).json({ error: 'Writer not found' });
    res.status(200).json(writer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch writer' });
  }
});

app.get('/api/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('primaryGenre'); // Fetch distinct genres from MongoDB
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});























// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete book with ID:', id); // Add a log to track the ID

    const book = await Book.findById(id);
    if (!book) {
      console.error('Book not found');
      return res.status(404).json({ error: 'Book not found' });
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error during book deletion:', error); // Log the error
    res.status(500).json({ error: 'Failed to delete book' });
  }
});



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
