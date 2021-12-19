const express = require('express');
const indexController = require('../controllers/indexController');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const postController = require('../controllers/postController');
const upgradeController = require('../controllers/upgradeController');

const router = express.Router();

// GET index page
router.get('/', indexController.index_get);

// GET register page
router.get('/register', registerController.register_get);

// POST register page
router.post('/register', registerController.register_post);

// GET login page
router.get('/login', loginController.login_get);

// POST login page
router.post('/login', loginController.login_post);

// GET post message page
router.get('/post-message', postController.post_message_get);

// POST post message page
router.post('/post-message', postController.post_message_post);

// GET become a member page
router.get('/member-register', upgradeController.member_register_get);

// POST become a member page
router.post('/member-register', upgradeController.member_register_post);

// GET become an admin page
router.get('/admin-register', upgradeController.admin_register_get);

// POST become an admin page
router.post('/admin_register', upgradeController.admin_register_post);

module.exports = router;
