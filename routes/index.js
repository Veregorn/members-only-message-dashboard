const express = require('express');
const router = express.Router();

// Require controller modules.
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', messageController.index);

/* GET user create page. */
router.get('/user/create', userController.user_create_get);

/* POST user create page. */
router.post('/user/create', userController.user_create_post);

module.exports = router;
