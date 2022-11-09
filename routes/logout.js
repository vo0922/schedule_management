const express = require('express');
const router = express.Router();

/**
 * 담당자 : 박신욱
 * 함수 설명 : 로그아웃 라우터
 * 주요 기능 : 세션을비우고 로그인 화면으로 리다이렉트
 */
router.get('/', function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;