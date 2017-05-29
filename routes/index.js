const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const playlistController = require('../controllers/playlistController');
const siteController = require('../controllers/siteController');

const {
  catchErrors
} = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', authController.homePage);
router.get('/auth', catchErrors(authController.requestAuthorizationCode));
router.get('/auth/callback', catchErrors(authController.setUserAccessToken));
router.get('/auth/logout', authController.logOut);

router.get('/playlists', catchErrors(playlistController.getPlaylists));
router.get('/:userid/playlists', catchErrors(playlistController.getPlaylists));
router.get('/:ownerid/:playlistid', catchErrors(playlistController.getPlaylistArtists));

router.get('/follow/:userid/:ownerid/:playlistid', catchErrors(playlistController.followPlaylistArtists));

router.get('/tools', siteController.getTools);
router.get('/homepage', siteController.homePage);





module.exports = router;
