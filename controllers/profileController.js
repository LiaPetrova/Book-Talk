const { hasUser } = require("../middlewares/guards");
const { getBooksByUser } = require("../services/bookService");

const profileController = require('express').Router();

profileController.get('/', hasUser(), async (req, res) => {
    const user = res.locals.user;
    const books = await getBooksByUser(user._id);
    res.render('profile', {
        title: 'Profile Page',
        books,
        email: user.email
    });
});

module.exports = profileController;