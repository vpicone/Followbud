var express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const SpotifyWebAPI = require('spotify-web-api-node');
const errorHandlers = require('./handlers/errorHandlers');
const helpers = require('./helpers');




var index = require('./routes/index');
var users = require('./routes/users');


var app = express();

spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CLIENT_CALLBACK
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.CLIENT_SECRET,
  // key: process.env.CLIENT_ID,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));








// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});



app.use('/', index);
app.use('/users', users);


// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

app.use(errorHandlers.developmentErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
