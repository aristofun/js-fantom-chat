const router = require('express-promise-router')();

// require models

// require controllers

// use controllers for endpoints
// router.use('/users', /*router here*/);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Fantom disposable chat' });
});

router.get('/chat', (req, res, next) => {
  res.render('chat', { title: 'Ghost chat in pure JavaScript' });
});

module.exports = router;
