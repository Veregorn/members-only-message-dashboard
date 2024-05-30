const express = require('express');
const router = express.Router();
const passport = require('passport');

// Require controller modules.
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', messageController.index);

/* GET user create page. */
router.get('/user/create', userController.user_create_get);

/* POST user create page. */
router.post('/user/create', userController.user_create_post);

/* GET user login page. */
router.get('/user/login', userController.user_login_get);

/* POST user login page. */
router.post('/user/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true,
}));

module.exports = router;