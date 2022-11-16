const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const tagController = require('../controller/tagController');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 통계 페이지 랜더링 라우터
 * 주요 기능 : 태그 통계 페이지를 랜더링 기능
 */
router.get('/', function (req, res, next) {
    res.render('statistics', {member: req.user, url: 'statistics'});
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 통계 페이지 에서의 태그 순위에 해당하는 나의 총 태그 데이터를 반환하는 API
 * 주요 기능 : 일정 컨트롤러에서 나의 총 태그를 반환받아 사용 횟수 별로 정렬을하여 response 하는 기능
 */
router.get('/totalTagSort', async function (req, res) {
    try {
        const totalTag = await scheduleController.totalTag(req.user._id)
        let result = totalTag.sort((a, b) => b.count - a.count);
        res.status(201).json({data: result, message: "총 태그"})
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "총 태그 가져오기 실패"})
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 통계 페이지에서 태그 차트의 하나의 태그를 클릭시 태그에 매핑되어있는 일정 반환하는 API
 * 주요 기능 : 태그 컨트롤러를 통해 하나의 태그로 관련된 일정데이터를 매치시킨 데이터를 response하는 기능
 */
router.post('/tagSchedule', async function (req, res) {
    try {
        const scheduleData = await tagController.findNameAndSchedule(req.body.name, req.user._id)
        res.status(201).json({data: scheduleData, message: "일정 가져오기 성공"})
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "일정 가져오기 실패"})
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 통계 페이지에서 태그 차트의 기타태그 클릭시 태그에 매핑되어있는 일정 반환하는 API
 * 주요 기능 : 태그 컨트롤러를 통해 기타에 관련한 여러가지의 태그에 관련된 일정 데이터를 매치시킨 데이터를 response하는 기능
 */
router.post('/tagManySchedule', async function (req, res) {
    try {
        const scheduleData = await tagController.findManyNameAndSchedule(req.body.name, req.user._id)
        res.status(201).json({data: scheduleData, message: "일정 가져오기 성공"})
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "일정 가져오기 실패"})
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 통계 페이지에서 내가 사용한 태그들의 사용횟수와 태그들을 반환하는 API
 * 주요 기능 : 일정컨트롤러에서 내가사용한 일정을통해 태그 사용횟수를 데이터를 response 하는 기능
 */
router.get('/totalTag', async function (req, res) {
    try {
        const totalTag = await scheduleController.totalTag(req.user._id)
        res.status(201).json({data: totalTag, message: "태그 사용횟수 가져오기 성공"})
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "태그 사용횟수 가져오기 실패"})
    }
})

/**
 * 담당자 : 이승현
 * 함수 설명 : 태그통계 페이지에서 렌더링시에 필요한 일정 데이터를 반환하는 API
 * 주요 기능 : 일정 컨트롤러에서 태그와 관련 일정 데이터를 반환하는 함수 호출 후 데이터 response
 */
router.get('/tagAboutSchedule', async function (req, res) {
    try {
        const page = req.query.page;
        const tagAboutScheduleData = await scheduleController.tagAboutSchedule(req.user._id, page)
        res.status(201).json({data: tagAboutScheduleData, message: "태그 관련 일정 목록 가져오기 성공"})
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "태그 관련 일정 목록 가져오기 실패"})
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그통계 페이지에서 클릭한 태그들의 일정을 반환하는 API
 * 주요 기능 : 태그 컨트롤러에서 태그와 관련 일정 데이터의 갯수를 반환하는 함수 호출 후 데이터 response
 */
router.post('/tagScheduleCount', async function (req, res) {
    try {
        const scheduleCount = await tagController.findTagScheduleCount(req.body.name, req.user._id)
        res.status(201).json({data: scheduleCount, message: "태그 관련 일정 갯수 가져오기 성공"})
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "일정 갯수 가져오기 실패"})
    }
})

module.exports = router;
