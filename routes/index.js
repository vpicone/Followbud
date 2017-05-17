const express = require('express');
const router = express.Router();
const SpotifyWebAPI = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CLIENT_CALLBACK
});

const scopes = ['user-read-private', 'user-read-email'];



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Followfy'
  });
});

router.get('/auth', function(req, res, next) {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

router.get('/auth/callback/', (req, res, next) => {
  const authorizationCode = req.query.code;
  spotifyApi.authorizationCodeGrant(authorizationCode)
    .then(function(data) {
      console.log('Retrieved access token', data.body['access_token']);

      // Set the access token
      spotifyApi.setAccessToken(data.body['access_token']);

      // Use the access token to retrieve information about the user connected to it
      return spotifyApi.getMe();
    })
    .then(function(data) {
      return spotifyApi.getUserPlaylists(data.body.id);
    })
    .then(function(data) {
      //console.log(data.body);
      const playlists = Array.from(data.body.items)
      const playlistNames = [];

      playlists.forEach(playlist => {
        playlistNames.push(playlist.name);
      });

      res.render('index', {
        title: 'Playlists',
        playlistNames,
      });
    })
    .catch(function(err) {
      console.log('Something went wrong', err.message);
    });


});




module.exports = router;
