const router = require('express-promise-router')();

// require models

// require controllers

// use controllers for endpoints
// router.use('/users', /*router here*/);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Fantom disposable chat' });
});

router.get('/healthz__', (req, res) => {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n');
});

router.get('/chat', (req, res, next) => {
  res.render('chat', { title: 'Ghost chat in pure JavaScript' });
});

module.exports = router;
