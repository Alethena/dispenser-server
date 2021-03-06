import { Request, Response, NextFunction } from 'express';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const dataRouter = require('./routes/data');
const dispenserRouter = require('./routes/dispenser');
const insiderRouter = require('./routes/insider');
const userRouter = require('./routes/user');
const verifyRouter = require('./routes/verify');

const app = express();

// const corsOptions = {
//   origin: 'https://dev.alethena.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(logger('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/dispenser/', dispenserRouter);
app.use('/insider/', insiderRouter);
app.use('/user/', userRouter);
app.use('/verify/', verifyRouter);

// catch 404 and forward to error handler
app.use(function(req : Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req : Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  res.locals.message = 'Sorry, an error occured!';
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = {};
  if (err.message == 'Not allowed by CORS') {
    res.locals.message = 'Forbidden';
    err.status = 403;
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
