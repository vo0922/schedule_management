const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET login page. */
router.get('/', function (req, res, next) {

    res.render('login', {title: 'Express'});
});

router.get('/naver', passport.authenticate('naver'));

router.get(
    '/naver/callback',
    passport.authenticate('naver', {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('/');
    }
)

router.get('/kakao', passport.authenticate('kakao'));

router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('/');
    }
)


module.exports = router;
