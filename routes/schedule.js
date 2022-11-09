const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정을 등록하는 API
 * 주요 기능 : 일정 컨트롤러에서 등록된 일정을 반환받아 데이터 response
 */
router.post('/', async function(req, res) {
    try{
        const data = await scheduleController.created(req.body ,req.user._id);
        res.status(201).json({data: data, message: "일정 등록 성공"});
    }catch(err){
        console.log(err);
        res.status(401).json({message: "일정 등록 실패"});
    }
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정을 수정하는 API
 * 주요 기능 : 일정 컨트롤러에서 일정을 업데이트하는 함수 실행 후 업데이트된 데이터 response
 */
router.patch('/', async function(req, res) {
    try{
        const data = await scheduleController.updated(req.body ,req.user._id);
        res.status(201).json({data: data, message: "일정 편집 성공"});
    }catch(err){
        console.log(err);
        res.status(401).json({message: "일정 편집 실패"});
    }
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정을 삭제하는 API
 * 주요 기능 : 일정 컨트롤에서 일정을 삭제시키는 함수 호출
 */
router.delete('/', async function(req, res) {
    try{
        const data = await scheduleController.deleted(req.body._id);
        res.status(201).json({data: data, message: "일정 삭제 성공"});
    }catch(err){
        console.log(err);
        res.status(401).json({message: "일정 삭제 실패"});
    }
})


module.exports = router;
