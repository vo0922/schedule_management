const express = require('express');
const authUtil = require("../middleware/auth").checkUser;
const router = express.Router();
const memberController = require('../controller/memberController');

/* GET home page. */
router.get('/', authUtil, function (req, res, next) {
    res.render('index', {member: req.user, url: 'home', kakaoKey: process.env.KAKAO_SCRIPT});
});

// 헤더 색상 변경 API
router.post('/colorUpdate', authUtil, async function (req, res) {
    try {
        const color = await memberController.colorUpdate(req.body.color, req.user._id)
        res.status(201).json({data: color, message: "색상 변경 성공"})
    } catch (e) {
        res.status(401).json({message: "색상 변경 실패"})
    }
})

module.exports = router;
