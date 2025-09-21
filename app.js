require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./src/routes/index');
var customersRouter = require('./src/routes/customer');
var authRouter = require('./src/routes/auth');
var filmsRouter = require('./src/routes/film');

var app = express();

const errorHandler = require('./src/utils/errorHandler');
const checkActiveStatus = require('./src/utils/checkActiveStatus');

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY || process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// User session availability in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(checkActiveStatus);

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customers', customersRouter);
app.use('/films', filmsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, `Page not found: ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
