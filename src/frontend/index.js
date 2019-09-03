const router = require('express-promise-router')();

// require models

// require controllers

// use controllers for endpoints
// router.use('/users', /*router here*/);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Realtime disposable chat' });
});

router.get('/chat', (req, res, next) => {
  res.render('chat', { title: 'JS/Socket.io chat' });
});

module.exports = router;
