const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const passport = require('./passportConfig');

const indexRouter = require('./routes/index');

// Import session for session management
const session = require('express-session');

const app = express();

// Load environment variables
require('dotenv').config();

// Set up mongoose connection
mongoose.set('strictQuery', false);
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD; 
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=myAtlasClusterEDU`;

mainModule().catch(err => console.error(err));
async function mainModule() {
  await mongoose.connect(dbURI);
  console.log("Connected to MongoDB");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Set up session management middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Set up passport for authentication
app.use(passport.session());

// Set up body parser for form data (req.body) (complex data not supported)
app.use(express.urlencoded({ extended: false }));

// Save user to session (called by passport.authenticate)
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // Set currentUser for EJS
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;