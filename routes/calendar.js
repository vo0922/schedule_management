const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const categoryController = require("../controller/categoryController");

/* GET calendar page. */
router.get('/', async function (req, res, next) {
    const shareCategory = await categoryController.shareCategory(req.user._id);
    const myCategory = await categoryController.findMy(req.user._id);
    const mySchedule = await scheduleController.mySchedule(req.user._id);
    res.render('calendar', {
        member: req.user,
        url: 'calendar',
        kakaoKey: process.env.KAKAO_SCRIPT,
        shareCategory: shareCategory,
        myCategory: myCategory,
        mySchedule: mySchedule,
    });
});

router.post('/scheduleView', async function (req, res) {
    try {
        const scheduleView = await scheduleController.readed(req.body.scheduleId);
        res.status(201).json({scheduleView: scheduleView, memberId: req.user._id});
    } catch (err) {
        res.status(401).json({message: "카테고리 삭제 실패"});
    }
})

router.get('/scheduleCalendar', async function (req, res) {
    try {
        const scheduleCalendar = await scheduleController.scheduleCalendar(req.user._id);
        res.status(201).json({scheduleCalendar: scheduleCalendar});
    } catch (err) {
        res.status(401).json({message: "일정 가져오기 실패"});
    }
})

router.post('/shareSchedule', async function (req, res) {
    try {
        const data = await categoryController.shareSchedule(req.body.categoryId, req.body.authMemberId);
        res.status(201).json({data: data, message: "일정 검색 성공"});
    } catch (err) {
        res.status(401).json({message: "일정 검색 실패"});
    }
})
module.exports = router;