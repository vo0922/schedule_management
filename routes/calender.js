const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
    res.render('calendar', { member: req.user, url:'calendar' });
});

module.exports = router;