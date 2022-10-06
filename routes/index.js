const express = require('express');
const authUtil = require("../middleware/auth").checkUser;
const router = express.Router();
const memberController = require('../controller/memberController');

/* GET home page. */
router.get('/', authUtil, function(req, res, next) {
  res.render('index', { member: req.user, url:'home', kakaoKey: process.env.KAKAO_SCRIPT });
});

// 헤더 색상 변경 API
router.get('/colorUpdate', function(req, res) {
  console.log(req.param("color"))
  try{
    const updateMember = memberController.colorUpdate(req.params.color, req.user._id)
    res.status(201).json({data:updateMember, message: "색상 변경 성공"})
  }catch(e){
    res.status(401).json({message: "색상 변경 실패"})
  }
})

module.exports = router;
