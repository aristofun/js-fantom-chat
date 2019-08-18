require('dotenv').config({ path: `./config/${process.env.NODE_ENV}.env` });

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

require('./config/mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const api = require('./src/api');
const frontend = require('./src/frontend');

app.use('/api/v1', api);
app.use('/', frontend);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const status = err.status || 500;
  res.status(status);

  if (req.is('application/json') || req.headers['content-type'] === 'application/json' || req.headers.json) {
    res.send({ status, message: err.message, error: err });
  } else {
    res.render('error');
  }
});

module.exports = app;
