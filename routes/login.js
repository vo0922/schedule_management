const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/register', memberController.register);

module.exports = router;
