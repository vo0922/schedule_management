const express = require('express');
const router = express.Router();
const tagController = require('../controller/tagController');
const {checkUser: authUtil} = require("../middleware/auth");

/* GET home page. */
router.get('/', authUtil, function(req, res, next) {
    res.render('tagTest');
});

router.post('/change', async function(req, res) {
    try{
        const data = await tagController.selectChange(req.body.text);
        if(data.length)
            res.status(201).json({data: data});
        else
            res.status(202).json({data: false});
    }catch(err){
        res.status(401).json({message: "태그 찾기 실패"});
    }
});

module.exports = router;
