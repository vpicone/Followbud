currentUser = {};

exports.getPlaylists = async(req, res) => {
  currentUser.id = (await spotifyApi.getMe()).body.id;
  currentUser.id = req.params.userid;
  currentUser.playlists = Array.from((await spotifyApi.getUserPlaylists(currentUser.id)).body.items);
  res.render('playlists', {
    title: 'Playlists',
    playlists: currentUser.playlists,
  });
};
