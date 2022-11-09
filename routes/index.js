const express = require('express');
const authUtil = require("../middleware/auth").checkUser;
const router = express.Router();
const memberController = require('../controller/memberController');
const scheduleController = require('../controller/scheduleController');
const memoController = require('../controller/memoController');
const categoryController = require('../controller/categoryController');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드 페이지 렌더링 라우터
 * 주요 기능 : 대쉬보드 페이지를 렌더링 기능
 */
router.get('/', authUtil, function (req, res, next) {
    res.render('index', {member: req.user, url: 'home', kakaoKey: process.env.KAKAO_SCRIPT});
});

/**
 * 담당자 : 이승현
 * 함수 설명 : 네비게이션 헤더바에서 색상을 변경할시 유저의 헤더색상 데이터를 변경해주는 API
 * 주요 기능 : 유저 컨트롤러에서 해당 유저 헤더색상을 변경해주는 함수 호출 후 변경된 색상 response
 */
router.post('/colorUpdate', authUtil, async function (req, res) {
    try {
        const color = await memberController.colorUpdate(req.body.color, req.user._id);
        res.status(201).json({data: color, message: "색상 변경 성공"});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "색상 변경 실패"});
    }
})

/**
 * 담당자 : 이승현, 박신욱
 * 함수 설명 : 대쉬 보드 페이지에 당일 일정 요소에 필요한 데이터를 반환하는 API
 * 주요 기능 : 일정 컨트롤러에서 당일 일정을 반환하는 함수 호출 후 데이터 response
 */
router.get('/todaySchedule', authUtil, async function (req, res) {
    try {
        const data = await scheduleController.todaySchedule(req.user._id);
        res.status(201).json({data: data});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "오늘 일정 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬 보드 페이지에서 유저의 메모를 반환하는 API
 * 주요 기능 : 메모 컨트롤러에서 유저메모 데이터를 반환하는 함수 호출 후 데이터 response
 */
router.get('/memo', authUtil, async function (req, res) {
    try {
        const data = await memoController.memoReaded(req.user._id);
        res.status(201).json({data: data});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "메모 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬 보드 페이지에서 유저의 메모를 삭제하는 API
 * 주요 기능 : 메모컨트롤러에서 인자로 넘긴 메모 _id 에 해당하는 메모를 삭제하는 기능
 */
router.delete('/memo', authUtil, async function (req, res) {
    try {
        const data = await memoController.memoDelete(req.body.memoId);
        res.status(201).json({data: data});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "메모 삭제 실패"})
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드에서 메모를 생성하는 API
 * 주요 기능 : 유저 _id, 메모 내용, 일정 _id 를 메모컨트롤러 생성 함수에 인자로 넘겨 생성된 메모 response
 */
router.post('/memo', authUtil, async function (req, res) {
    try {
        const data = await memoController.memoInsert(req.user._id, req.body.content, req.body.scheduleId);
        res.status(201).json({data: data});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "메모 등록 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드 페이지의 메모 상세 모달창에서 일정을 검색에 필요한 데이터를 반환하기 위한 API
 * 주요 기능 : 메모 컨트롤러에서 메모상세 정보에 필요한 데이터 와 일정 컨트롤러에서 일정을 매핑할수 있는 일정을 반환 하여 데이터들을 response
 */
router.post('/memo/view/search', authUtil, async function (req, res) {
    try {
        const memoData = await memoController.memoFind(req.body.memoId);
        const myScheduleData = await scheduleController.myScheduleSearch(req.user._id, req.body.text);
        res.status(201).json({memoData: memoData, myScheduleData: myScheduleData});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "메모 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모 상세모달창에 필요한 데이터들을 반환하는 API
 * 주요 기능 : 메모 컨트럴러에서 해당 메모의 데이터를 반환하는 함수와 일정 컨트롤러에서 렌더링시에 보여질 일정 리스트들을 함께 response
 */
router.post('/memo/view', authUtil, async function (req, res) {
    try {
        const memoData = await memoController.memoFind(req.body.memoId);
        const myScheduleData = await scheduleController.mySchedule(req.user._id);
        res.status(201).json({memoData: memoData, myScheduleData: myScheduleData});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "메모 가져오기 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모를 수정하는 API
 * 주요 기능 : 메모 컨트롤러에서 메모를 수정하는 함수를 호출후 수정된 메모 데이터 response
 */
router.patch('/memo', authUtil, async function (req, res) {
    try {
        const data = await memoController.memoUpdate(req.body.data);
        res.status(201).json({data: data});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "메모 업데이트 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드 페이지에서 사용될 당일 공유 일정의 데이터를 반환 하는 API
 * 주요 기능 : 카테고리 컨트롤러에서 request받은 진행도 데이터에 따라 당일 전체공유 일정, 진행중인 공유일정, 완료된 진행일정 을 구분하여 데이터를 반환하는 함수를 호출 후 데이터 response
 */
router.post('/todayShareSchedule', authUtil, async function (req, res) {
    try {
        let progress = req.body.progress != null ? req.body.progress : null
        const data = await categoryController.todayShareSchedule(req.user._id, progress);
        res.status(201).json({data: data});
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "공유된 일정 가져오기 실패"});
    }
})

/**
 * 담당자 : 이승현
 * 함수 설명 : 대쉬보드 페이지에서 당일 일정들의 변경된 진행도를 update해주는 API
 * 주요 기능 : 일정컨트롤러에서 해당 일정 진행도를 변경해주는 함수 호출 후 변경된 데이터 response
 */
router.patch('/todayScheduleProgress', authUtil, async function (req, res) {
    try {
        const data = await scheduleController.scheduleProgress(req.body.scheduleId, req.body.progress)
        res.status(201).json({data: data})
    } catch (e) {
        console.log(e);
        res.status(401).json({message: "일정 진행도 변경 실패"})
    }
})

module.exports = router;
