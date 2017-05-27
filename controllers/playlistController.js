currentUser = {};

exports.getPlaylists = async(req, res) => {
  currentUser.id = (await spotifyApi.getMe()).body.id;
  currentUser.id = req.params.userid;
  currentUser.playlists = Array.from((await spotifyApi.getUserPlaylists(currentUser.id)).body.items);
  res.render('playlists', {
    title: 'Playlists',
    playlists: currentUser.playlists,
    currentUser: currentUser.id,
  });
};

exports.getPlaylistArtists = async(req, res) => {
  const playlistid = req.params.playlistid;
  const ownerid = req.params.ownerid;
  const userid = req.params.userid;
  const tracks = Array.from((await spotifyApi.getPlaylistTracks(req.params.ownerid, req.params.playlistid, {"fields" : "items.track(name,artists)"})).body.items);
  let playlistArtists = [];
  tracks.forEach(thisTrack => {
    const artists = Array.from(thisTrack.track.artists)
      artists.forEach(artist => {
        playlistArtists.push(artist);
      });
  });
  

  res.render('playlistDetail', {
    title: 'Playlist Detail View',
    tracks,
    userid,
    playlistArtists,
  });
  // res.json(tracks);
};
