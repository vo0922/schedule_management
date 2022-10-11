const express = require('express');
const categoryController = require("../controller/categoryController");
const router = express.Router();

router.post('/', async function(req, res) {
    try{
        const data = await categoryController.created(req.body ,req.user._id);
        res.status(201).json({data: data, message: "카테고리 생성 성공"});
    }catch(err){
        res.status(401).json({message: "카테고리 생성 실패"});
    }
});

router.patch('/', async function(req, res) {
    try{
        const data = await categoryController.updated(req.body);
        res.status(201).json({data: data, message: "카테고리 편집 성공"});
    }catch(err){
        res.status(401).json({message: "카테고리 편집 실패"});
    }
});

router.delete('/', async function(req, res) {
    try{
        const data = await categoryController.deleted(req.body.categoryId);
        res.status(201).json({data: data, message: "카테고리 삭제 성공"});
    }catch(err){
        res.status(401).json({message: "카테고리 삭제 실패"});
    }
});


module.exports = router;