require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var customersRouter = require('./src/routes/customer');

var app = express();

const errorHandler = require('./src/utils/errorHandler');

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', indexRouter);
app.use('/customers', customersRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
