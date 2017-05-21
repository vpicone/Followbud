const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  catchErrors
} = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', catchErrors(authController.homePage));
router.get('/auth', catchErrors(authController.requestAuthorizationCode));
router.get('/auth/callback', catchErrors(authController.getPlaylists));
router.get('/auth/logout', authController.logOut);



module.exports = router;
