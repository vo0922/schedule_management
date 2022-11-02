const express = require('express');
const authUtil = require("../middleware/auth").checkUser;
const router = express.Router();
const memberController = require('../controller/memberController');
const scheduleController = require('../controller/scheduleController');
const memoController = require('../controller/memoController');
const categoryController = require('../controller/categoryController');

/* GET home page. */
router.get('/', authUtil, function (req, res, next) {
    res.render('index', {member: req.user, url: 'home', kakaoKey: process.env.KAKAO_SCRIPT});
});

// 헤더 색상 변경 API
router.post('/colorUpdate', authUtil, async function (req, res) {
    try {
        const color = await memberController.colorUpdate(req.body.color, req.user._id);
        res.status(201).json({data: color, message: "색상 변경 성공"});
    } catch (e) {
        res.status(401).json({message: "색상 변경 실패"});
    }
})

// 일정 완료율 API
router.get('/todaySchedule', async function (req, res) {
    try {
        const data = await scheduleController.todaySchedule(req.user._id);
        res.status(201).json({data: data});
    } catch (e) {
        res.status(401).json({message: "오늘 일정 가져오기 실패"});
    }
})

router.get('/memo', async function (req, res) {
    try {
        const data = await memoController.memoReaded(req.user._id);
        res.status(201).json({data: data});
    } catch (e) {
        res.status(401).json({message: "메모 가져오기 실패"});
    }
})


router.delete('/memo', async function (req, res) {
    try {
        const data = await memoController.memoDelete(req.body.memoId);
        res.status(201).json({data: data});
    } catch (e) {
        res.status(401).json({message: "메모 삭제 실패"})
    }
})

router.post('/memo', async function (req, res) {
    try {
        const data = await memoController.memoInsert(req.user._id, req.body.content, req.body.scheduleId);
        res.status(201).json({data: data});
    } catch (e) {
        res.status(401).json({message: "메모 등록 실패"});
    }
})

router.post('/memo/view/search', async function (req, res) {
    try {
        const memoData = await memoController.memoFind(req.body.memoId);
        const myScheduleData = await scheduleController.myScheduleSearch(req.user._id, req.body.text);
        res.status(201).json({memoData: memoData, myScheduleData: myScheduleData});
    } catch (e) {
        res.status(401).json({message: "메모 가져오기 실패"});
    }
})

router.post('/memo/view', async function (req, res) {
    try {
        const memoData = await memoController.memoFind(req.body.memoId);
        const myScheduleData = await scheduleController.mySchedule(req.user._id);
        res.status(201).json({memoData: memoData, myScheduleData: myScheduleData});
    } catch (e) {
        res.status(401).json({message: "메모 가져오기 실패"});
    }
})

router.patch('/memo', async function (req, res) {
    try {
        const data = await memoController.memoUpdate(req.body.data);
        res.status(201).json({data: data});
    } catch (e) {
        res.status(401).json({message: "메모 업데이트 실패"});
    }
})

router.post('/todayShareSchedule', async function (req, res) {
    try {
        let progress = req.body.progress != null ? req.body.progress : null
        const data = await categoryController.todayShareSchedule(req.user._id, progress);
        res.status(201).json({data: data});
    } catch (e) {
        res.status(401).json({message: "메모 업데이트 실패"});
    }
})

module.exports = router;
