const express = require('express');
const router = express.Router();
const tagController = require('../controller/tagController');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 검색 라우터
 * 주요 기능 : 태그 검색 완료후 검색된 태그 데이터 리턴
 */
router.post('/change', async function(req, res) {
    try{
        const data = await tagController.selectChange(req.body.text);
        if(data.length)
            res.json({data: data});
        else
            res.json({data: false});
    }catch(err){
        console.log(err);
        res.status(401).json({message: "태그 찾기 실패"});
    }
});

module.exports = router;
