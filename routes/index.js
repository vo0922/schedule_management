const express = require('express');
const authUtil = require("../middleware/auth").checkUser;
const router = express.Router();

/* GET home page. */
router.get('/', authUtil, function(req, res, next) {
  res.render('index', { member: req.user, url:'home' });
});

/* GET home page. */
router.get('/kakaoMap', function(req, res, next) {
  res.render('kakaoMap', { kakaoKey: process.env.KAKAO_SCRIPT });
});

module.exports = router;
