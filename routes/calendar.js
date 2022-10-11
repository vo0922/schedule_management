const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
/* GET calendar page. */
router.get('/', function(req, res, next) {
    res.render('calendar', { member: req.user, url:'calendar', kakaoKey: process.env.KAKAO_SCRIPT });
});

router.get('/scheduleCalendar', async function (req, res) {
    try{
        const scheduleCalendar = await scheduleController.scheduleCalendar(req.user._id);
        res.status(201).json({scheduleCalendar: scheduleCalendar});
    }catch (err){
        res.status(401).json({message: "카테고리 삭제 실패"});
    }
})
module.exports = router;