const express = require('express');
const router = express.Router();

/* GET 태그통계 page. */
router.get('/', function (req, res, next) {
    res.render('statistics', {member: req.user, url: 'statistics'});
});

module.exports = router;
