const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');

router.post('/', async function(req, res) {
    try{
        const data = await scheduleController.created(req.body ,req.user._id);
        res.status(201).json({data: data, message: "일정 등록 성공"});
    }catch(err){
        res.status(401).json({message: "일정 등록 실패"});
    }
});

router.patch('/', async function(req, res) {
    try{
        const data = await scheduleController.updated(req.body ,req.user._id);
        res.status(201).json({data: data, message: "일정 편집 성공"});
    }catch(err){
        res.status(401).json({message: "일정 편집 실패"});
    }
});

router.delete('/', async function(req, res) {
    try{
        const data = await scheduleController.deleted(req.body._id);
        res.status(201).json({data: data, message: "일정 삭제 성공"});
    }catch(err){
        res.status(401).json({message: "일정 삭제 실패"});
    }
})


module.exports = router;
