const SpotifyWebAPI = require('spotify-web-api-node');
const open = require('open');

const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CLIENT_CALLBACK
});

const scopes = ['user-read-private', 'user-read-email'];

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'Followfy|Home'
  });
};

exports.requestAuthorizationCode = (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};

exports.getPlaylists = (req, res, next) => {
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
      const playlists = Array.from(data.body.items);
      //res.json(playlists);
      res.render('index', {
        title: 'Playlists',
        playlists
      });
    })
    .catch(function(err) {
      console.log('Something went wrong', err.message);
    });
};


exports.logOut = (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  open("http:www.spotify.com/logout");
  res.redirect('/');
};
