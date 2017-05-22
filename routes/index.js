const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const {
  catchErrors
} = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', authController.homePage);
router.get('/auth', catchErrors(authController.requestAuthorizationCode));
router.get('/auth/callback', catchErrors(authController.setUserAccessToken));
router.get('/auth/logout', authController.logOut);

router.get('/playlists', catchErrors(userController.getPlaylists));
router.get('/:userid/playlists', catchErrors(userController.getPlaylists));




module.exports = router;
