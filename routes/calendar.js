const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const categoryController = require("../controller/categoryController");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린터 페이지 렌더링 라우터
 * 주요 기능 : 캘린터 페이지 렌더링 기능
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린더 페이지에서 일정 상세데이터를 반환하는 API
 * 주요 기능 : 일정 컨트롤러에서 일정을 검색하는 함수 호출 후 데이터 response
 */
router.post('/scheduleView', async function (req, res) {
    try {
        const scheduleView = await scheduleController.readed(req.body.scheduleId);
        res.status(201).json({scheduleView: scheduleView, memberId: req.user._id});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "일정 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저의 일정을 반환하는 API
 * 주요 기능 : 일정 컨트롤러에서 유저의 일정을 반환하는 함수를 호출 후 데이터 response
 */
router.get('/mySchedule', async function (req, res) {
    try {
        const mySchedule = await scheduleController.mySchedule(req.user._id);
        res.status(201).json({data: mySchedule});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "나의 일정 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린더에 바인딩될 유저 전체 일정을 반환하는 API
 * 주요 기능 : 일정 컨트롤러에서 유저의 모든 일정을 반환하는 함수 호출 후 데이터 response
 */
router.get('/scheduleCalendar', async function (req, res) {
    try {
        const scheduleCalendar = await scheduleController.scheduleCalendar(req.user._id);
        res.status(201).json({data: scheduleCalendar});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "일정 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린더에 바인딩될 유저가 공유받은 모든 일정을 반환하는 API
 * 주요 기능 : 카테고리 컨트롤러에서 유저가 공유받은 모든 일정을 반환하는 함수 호출 후 데이터 response
 */
router.get('/shareAllSchedule', async function (req, res) {
    try {
        const data = await categoryController.shareAllSchedule(req.user._id);
        res.status(201).json({data: data});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "공유 일정 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린더에 바인딩될 공유된 하나의 카테고리에 관한 일정들을 반환하는 API
 * 주요 기능 : 카테고리 컨트롤러에서 유저와 공유된 하나의 카테고리에 관한 일정을 반환하는 함수 호출 후 데이터 response
 */
router.post('/shareSchedule', async function (req, res) {
    try {
        const data = await categoryController.shareSchedule(req.body.categoryId, req.body.authMemberId);
        res.status(201).json({data: data, message: "공유 검색 성공"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "공유 일정 검색 실패"});
    }
})

module.exports = router;