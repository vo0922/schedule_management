const express = require('express');
const categoryController = require("../controller/categoryController");
const memberController = require("../controller/memberController");
const router = express.Router();

/**
 * 담당자 : 박신욱
 * 함수 설명 : 지정한 하나의 카테고리 데이터를 반환하는 API
 * 주요 기능 : 카테고리 _id 를통해 카테고리 컨트롤러에서 카테고리 데이터를 반환하는 함수 호출 후 데이터 response
 */
router.post('/search', async function(req,res){
    try {
        const data = await categoryController.findOne(req.body._id);
        res.status(201).json({data: data, message: "카테고리 검색 성공"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "카테고리 검색 실패"});
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리를 생성하기 위한 API
 * 주요 기능 : 카테고리 컨트롤러에서 카테고리를 생성하는 함수 호출 후 생성된 데이터 response
 */
router.post('/', async function (req, res) {
    try {
        const data = await categoryController.created(req.body, req.user._id);
        res.status(201).json({data: data, message: "카테고리 생성 성공"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "카테고리 생성 실패"});
    }
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 수정 API
 * 주요 기능 : 카테고리 컨트롤러에서 카테고리를 편집하는 함수 호출후 수정된 데이터 response
 */
router.patch('/', async function (req, res) {
    try {
        const data = await categoryController.updated(req.body);
        res.status(201).json({data: data, message: "카테고리 편집 성공"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "카테고리 편집 실패"});
    }
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리를 삭제하는 API
 * 주요 기능 : 카테고리 컨트롤러에서 카테고리를 삭제하는 함수 호출하는 기능
 */
router.delete('/', async function (req, res) {
    try {
        const data = await categoryController.deleted(req.body.categoryId);
        res.status(201).json({data: data, message: "카테고리 삭제 성공"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "카테고리 삭제 실패"});
    }
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리에서 공유된 사용자를 검색하기위한 API
 * 주요 기능 : 유저컨트롤러에서 검색된 유저 데이터를 반환하는 함수 호출 후 데이터 response
 */
router.post('/userSearch', async function (req, res) {
    try {
        const data = await memberController.memberFind(req.body.text);
        res.status(201).json({data: data, message: "유저 검색 성공"});
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "유저 검색 실패"});
    }
});

module.exports = router;