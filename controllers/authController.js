let currentUser = {};

const scopes = ['user-follow-read', 'user-follow-modify', 'playlist-read-collaborative', 'playlist-read-private', 'user-top-read', 'user-library-read', 'user-top-read'];

exports.homePage = (req, res) => {
  res.render('playlists', {
    title: 'Followbud - Home'
  });
};

exports.requestAuthorizationCode = async(req, res) => {
  //req.session.test = 'test';
  const authorizeURL = await req.spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};


// To do: seperate authorization logic via sessions
exports.setUserAccessToken = async(req, res) => {
  const authorizationCode = req.query.code;
  req.spotifyApi.setAccessToken((await req.spotifyApi.authorizationCodeGrant(authorizationCode)).body['access_token']);
  const userid = (await req.spotifyApi.getMe()).body.id;
  res.redirect(`/${userid}/playlists`);
};
