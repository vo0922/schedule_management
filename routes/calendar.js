const express = require('express');
const router = express.Router();

/* GET calendar page. */
router.get('/',function(req, res, next) {
    res.render('calendar', { member: req.user, url:'calendar', kakaoKey: process.env.KAKAO_SCRIPT });
});

module.exports = router;