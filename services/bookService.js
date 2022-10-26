const Book = require("../models/Book");

async function getAll () {
    return Book.find({}).lean();
}

async function getById (id) {
    return Book.findById(id).populate('owner').populate('wishingList').lean();
}

async function getByIdRaw (id) {
    return Book.findById(id);

}

async function createBook (data) {
    const book = {
    title: data.title,
    author: data.author,
    genre: data.genre,
    stars: Number(data.stars),
    imageUrl: data.imageUrl,
    review: data.review,
    owner: data.owner
    }
    return Book.create(book);
}

async function editBook (existingId, data) {

    const existing = await Book.findById(existingId);
    existing.title = data.title;
    existing.author = data.author;
    existing.genre = data.genre;
    existing.stars = Number(data.stars);
    existing.imageUrl = data.imageUrl;
    existing.review = data.review;

    return existing.save();
}

async function deleteBook (bookId) {
    return Book.findByIdAndRemove(bookId);
}

async function wishBook (bookId, userId) {
    const book = await Book.findById(bookId);
    book.wishingList.push(userId);

    return book.save();
}

async function getBooksByUser (userId) {
    const books = await Book.find({ 'wishingList': userId}).lean();
    return books;
}

module.exports = {
    getAll,
    getById,
    getByIdRaw,
    createBook,
    editBook,
    deleteBook,
    wishBook,
    getBooksByUser
}