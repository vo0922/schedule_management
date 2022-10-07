const express = require('express');
const router = express.Router();
const tagController = require('../controller/tagController');
const {checkUser: authUtil} = require("../middleware/auth");

router.post('/change', async function(req, res) {
    try{
        const data = await tagController.selectChange(req.body.text);
        if(data.length)
            res.json({data: data});
        else
            res.json({data: false});
    }catch(err){
        res.status(401).json({message: "태그 찾기 실패"});
    }
});

module.exports = router;
