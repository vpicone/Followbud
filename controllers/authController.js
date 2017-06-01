let currentUser = {};

const scopes = ['user-follow-read', 'user-follow-modify', 'playlist-read-collaborative', 'playlist-read-private', 'user-top-read', 'user-library-read', 'user-top-read'];

exports.homePage = (req, res) => {
  res.render('playlists', {
    title: 'Followfy - Home'
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
