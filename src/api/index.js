const router = require('express-promise-router')();

const createError = require('http-errors');

// require models

// require controllers

// use controllers for endpoints
// router.use('/users', /*router here*/);

/* GET home page. */
router.get('/qu', (req, res, next) => {
  next(createError(500, 'fuck you'));
});

module.exports = router;
