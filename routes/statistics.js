const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');

/* GET 태그통계 page. */
router.get('/', function (req, res, next) {
    res.render('statistics', {member: req.user, url: 'statistics'});
});

router.get('/totalTagSort', async function (req, res) {
    try{
        const totalTag = await scheduleController.totalTag(req.user._id)
        let result = totalTag.sort((a, b) => b.count - a.count);
        res.status(201).json({data: result, message: "태그 정렬 성공"})
    }catch(err) {
        console.log(err)
        res.status(401).json({message: "총 태그정렬 실패"})
    }
})

// 태그 통계 라우터
router.get('/totalTag', async function (req, res) {
    try{
        const totalTag = await scheduleController.totalTag(req.user._id)
        res.status(201).json({data: totalTag, message: "나의 총 일정"})
    }catch(err) {
        console.log(err)
        res.status(401).json({message: "갯수 세기 실패"})
    }
})

module.exports = router;
