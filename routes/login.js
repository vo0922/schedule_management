const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그인 페이지 렌더링 라우터
 * 주요 기능 : 로그인 페이지를 렌더링 기능
 */
router.get('/', function (req, res, next) {
    res.render('login', {title: 'Express'});
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 네이버 로그인 API
 * 주요 기능 : passport에 등록된 네이버 로그인을 실행하는 함수
 */
router.get('/naver', passport.authenticate('naver'));

/**
 * 담당자 : 박신욱
 * 함수 설명 : 네이버 로그인 callback API
 * 주요 기능 : 네이버 로그인에 성공했을경우 index페이지로 리다이렉트
 */
router.get(
    '/naver/callback',
    passport.authenticate('naver', {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('/');
    }
)

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카카오 로그인 API
 * 주요 기능 : passport에 등록된 카카오 로그인을 실행하는 함수
 */
router.get('/kakao', passport.authenticate('kakao'));

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카카오 로그인 callback API
 * 주요 기능 : 카카오 로그인에 성공했을 경우 index페이지로 리다이렉트
 */
router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('/');
    }
)


module.exports = router;
