const SpotifyWebAPI = require('spotify-web-api-node');
const open = require('open');

const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CLIENT_CALLBACK
});

let currentUser = {};

const scopes = ['user-read-private', 'user-read-email'];

exports.homePage = async(req, res) => {
  await res.render('index', {
    title: 'Followfy|Home'
  });
};

exports.requestAuthorizationCode = async(req, res) => {
  const authorizeURL = await spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};

/*exports.setUserAccessToken = async(req, res) => {
  const authorizationCode = req.query.code;
  spotifyApi.setAccessToken((await spotifyApi.authorizationCodeGrant(authorizationCode)).body['access_token']);
}*/

exports.getPlaylists = async(req, res, next) => {
  const authorizationCode = req.query.code;
  spotifyApi.setAccessToken((await spotifyApi.authorizationCodeGrant(authorizationCode)).body['access_token']);
  currentUser.id = (await spotifyApi.getMe()).body.id;
  currentUser.playlists = Array.from((await spotifyApi.getUserPlaylists(currentUser.id)).body.items);
  console.log(currentUser.playlists[0]);
  res.render('index', {
    title: 'Playlists',
    playlists: currentUser.playlists,
  });
};

/*spotifyApi.authorizationCodeGrant(authorizationCode)
    .then(function(data) {
      console.log('Retrieved access token', data.body['access_token']);
      // Set the access token
      spotifyApi.setAccessToken(data.body['access_token']);
      // Use the access token to retrieve information about the user connected to it
      return spotifyApi.getMe();
    })
    .then(function(data) {
      //set the user object's ID
      currentUser.userid = data.body.id;
      return spotifyApi.getUserPlaylists(data.body.id);
    })
    .then(function(data) {
      //set the userObject's playlists
      return data;
    })
    .then(function(data) {
      //set the userObject's playlists
      currentUser.playlists = Array.from(data.body.items);
      const playlists = Array.from(data.body.items);
      //console.log(currentUser.followedArtists);
      //res.json(playlists);
      res.render('index', {
        title: 'Playlists',
        playlists,
        currentUser,
      });
    })
    .catch(function(err) {
      console.log('Something went wrong', err.message);
    });
};*/


exports.logOut = (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  open("http:www.spotify.com/logout");
  res.redirect('/');
};
