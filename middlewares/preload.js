const { getById, getByIdRaw } = require("../services/bookService"); //TODO

module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.book = await getById(req.params.id);
    } else {
        res.locals.book = await getByIdRaw(req.params.id);
    }

    next();
};