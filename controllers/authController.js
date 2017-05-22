const open = require('open');

let currentUser = {};

const scopes = ['user-read-private', 'user-read-email'];

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'Followfy|Home'
  });
};

exports.requestAuthorizationCode = async(req, res) => {
  const authorizeURL = await spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};


// To do: seperate authorization logic via sessions
exports.setUserAccessToken = async(req, res) => {
  const authorizationCode = req.query.code;
  spotifyApi.setAccessToken((await spotifyApi.authorizationCodeGrant(authorizationCode)).body['access_token']);
  const userid = (await spotifyApi.getMe()).body.id;
  res.redirect(`/${userid}/playlists`);
};

exports.logOut = (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  open("http:www.spotify.com/logout");
  res.redirect('/');
};