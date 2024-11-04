const mongoose = require('mongoose');

const bookSummarySchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    name: String,
    description: String,
    readsCount: { type: Number, default: 0 },
    primaryGenre: String,
    coverImage: String,
    createdAt: { type: Date, default: Date.now }
});

bookSummarySchema.methods.incrementReads = async function() {
    this.readsCount += 1;
    await this.save();
};

const BookSummary = mongoose.model('BookSummary', bookSummarySchema);
module.exports = BookSummary;
