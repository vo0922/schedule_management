const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authUtil = require("./middleware/auth").checkUser;

// .env
require('dotenv').config();

// passport
const passport = require('passport');
const passportConfig = require('./passport');
const session = require("express-session");

passportConfig();

// router
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const scheduleRouter = require('./routes/schedule');
const calendarRouter = require('./routes/calendar');
const tagRouter = require('./routes/tag');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// 쿠키 세션 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    }),
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장

// router config
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.use('/schedule', authUtil, scheduleRouter);
app.use('/calendar', authUtil, calendarRouter);
app.use('/tag', authUtil, tagRouter);

/**
 * 담당자 : 박신욱
 * 함수 설명 : 몽고 db의 admin 계정 정보 외부 url 주소
 */
const id = "admin";
const pwd = "heven";
const url = `mongodb://${id}:${pwd}@13.125.245.95:27017/admin`

/**
 * 담당자 : 박신욱
 * 함수 설명 : 데이터베이스 연동
 */
mongoose
    .connect(url,
        {dbName: 'schedule_management'},
        {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
