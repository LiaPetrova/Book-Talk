const { hasUser, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { createBook, getAll, editBook, deleteBook, wishBook } = require('../services/bookService');
const { parseError } = require('../util/parser');

const bookController = require('express').Router();

bookController.get('/catalog', async (req, res) => {
    const books = await getAll();

    res.render('catalog', {
        title: 'All books',
        books
    });
});

bookController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Book Review'
    });
});

bookController.post('/create', hasUser(), async (req, res) => {
    const book = req.body;
    book.owner = req.user._id;
    
    try {
        await createBook(book);
        res.redirect('/book/catalog');

    } catch (error) {
        res.render('create', {
            title: 'Create Book Review',
            errors: parseError(error),
            book
        });
    }
});

bookController.get('/:id/details', preload(true), async (req, res) => {
    const book = res.locals.book;
    book.isOwner = req.user?._id == book.owner._id;
    book.hasWished = book.wishingList.some(u => u._id.toString() ==  req.user?._id.toString());

    res.render('details', {
        title: `${book.title} Details`,
        book
    });
});

bookController.get('/:id/edit', preload(true), isOwner(), async (req, res) => {
    const book = res.locals.book;

    res.render('edit', {
        title: `Edit ${book.title}`,
        book
    });
});

bookController.post('/:id/edit', preload(true), isOwner(), async (req, res) => {
    const book = res.locals.book;
    const edited = req.body;
    edited._id = book._id;

    try {
        await editBook(book._id, edited);
        res.redirect(`/book/${book._id}/details`);
    } catch (error) {
        
        res.render('edit', {
            title: `Edit ${book.title}`,
            book: edited,
            errors: parseError(error)
        });
    }

});

bookController.get('/:id/delete', preload(), isOwner(), async (req, res) => {
    await deleteBook(req.locals.book_id);
    res.redirect('/book/catalog');
});

bookController.get('/:id/wish', hasUser(), preload(true), async (req, res) => {
    const book = res.locals.book;

    try {
        if(book.wishingList.some(u => u._id.toString() == req.user._id)) {
            book.hasWished = true;
            throw new Error('You already added the book to your wish list');
        }

        if(book.owner._id == req.user._id) {
            book.isOwner = true;
            throw new Error('You cannot add your own book to yours wish list');
        }
        await wishBook(book._id, req.user._id);
        res.redirect(`/book/${book._id}/details`);

    } catch (error) {
        res.render('details', {
            title: `${book.title} Details`,
            book,
            errors: parseError(error)
        });
    }

});

module.exports = bookController;