const express = require('express');
const router = express.Router();

// Require controller modules.
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');
const user = require('../models/user');

/* GET home page. */
router.get('/', messageController.index);

/* GET user create page. */
router.get('/user/create', userController.user_create_get);

/* POST user create page. */
router.post('/user/create', userController.user_create_post);

/* GET user login page. */
router.get('/user/login', userController.user_login_get);

/* POST user login page. */
router.post('/user/login', userController.user_login_post);

/* GET user logout page. */
router.get('/user/logout', userController.user_logout_get);

/* GET user profile page. */
router.get('/user/profile', userController.user_profile_get);

/* POST user profile page. */
router.post('/user/profile', userController.user_profile_post);

/* GET message create page. */
router.get('/message/create', messageController.message_create_get);

/* POST message create page. */
router.post('/message/create', messageController.message_create_post);

/* POST message delete page. */
router.post('/message/:id/delete', messageController.message_delete_post);

module.exports = router;