const router = require('express-promise-router')();

// require models

// require controllers

// use controllers for endpoints
// router.use('/users', /*router here*/);

/* GET home page. */
router.get('/qu', (req, res, next) => {
  res.render('index', { title: 'Express !!!!' });
});

module.exports = router;
