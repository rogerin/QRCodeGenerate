require('newrelic');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
require('dotenv').config();
var qrcodeRouter = require('./src/routes/qrcode')


var debug = require('debug')('qrcodegenerate:server');
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

var port = process.env.PORT || '3000';
app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/qrcode', qrcodeRouter);

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



var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`rodando na porta ${port}`)
});
