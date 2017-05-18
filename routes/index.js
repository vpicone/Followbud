const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', authController.homePage);
router.get('/auth', authController.requestAuthorizationCode);
router.get('/auth/callback', authController.getPlaylists);
router.get('/auth/logout', authController.logOut);



module.exports = router;
