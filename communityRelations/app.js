var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const bodyParser = require("body-parser");

require('dotenv').config();

// //Routes
var indexRouter = require('./routes/index'); //predefin
var usersRouter = require('./routes/authentication');//predefined
// var headerMasterRouter = require('./routes/headermaster');
// var authRouter = require('./routes/authentication');
// var deptsgrpRouter = require('./routes/deptsgrp');


const session = require('express-session');
var MemoryStore = require('memorystore')(session)


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: {maxAge: 3600000},
  store: new MemoryStore({
    checkPeriod:3600000
  }),
  resave:false,
  secret: 'LCMC_COR',
  saveUninitialized: false,
}))

var whitelist =[
  'http://localhost:3005',
  'http://127.0.0.1:3005/',
  'http://localhost',
  'https://192.168.44.26:443',
  'https://192.168.44.26:444',
  'http://192.168.44.26',
  'http://192.168.44.26:3005'
];

var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'device-remember-token',
		'Access-Control-Allow-Origin',
		'Origin',
		'Accept',
		'app_id ',
		'user',
		'password ',
	],
};

app.use(cors(corsOptions));


//calling of routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
// app.use('/api/authentication', authRouter);
// app.use('/api/deptsgrp',deptsgrpRouter)
// app.use('/api/headermaster',headerMasterRouter);



app.set('trust proxy',true);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
