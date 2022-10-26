const { model, Schema, Types } = require('mongoose');

const URL_PATTERN = /^https?:\/\/.*$/i;

const bookSchema = new Schema ({
    title: { type: String, minLength: [2, 'The title of the book must be at least 2 chatacters long']},
    author: { type: String, minLength: [5, 'The Authorsname must be at least 5 chatacters long']},
    genre: { type: String, minLength: [3, 'Genre must be at least 3 chatacters long']},
    review: { type: String, minLength: [10, 'Book review must be at least 10 chatacters long']},
    imageUrl: { type: String, validate: {
        validator: (value) => (URL_PATTERN.test(value)),
        message: 'Invalid URL'
    }},
    stars: { type: Number, min: [1, 'Stars can be between 1 and 5'], max: [5, 'Stars can be between 1 and 5']},
    wishingList: { type: [Types.ObjectId], ref: 'User', default: []},
    owner: { type: Types.ObjectId, required: true, ref: 'User'}
});


const Book = model('Book', bookSchema);

module.exports = Book;
