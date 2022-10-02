const express = require('express');
const authUtil = require("../middleware/auth").checkUser;
const router = express.Router();

/* GET home page. */
router.get('/', authUtil, function(req, res, next) {
  console.log(req.session.passport);
  res.render('index', { title: 'Express' });
});

module.exports = router;
