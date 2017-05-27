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
  const tracks = Array.from((await spotifyApi.getPlaylistTracks(req.params.ownerid, req.params.playlistid, {
    "fields": "items.track(name,artists)"
  })).body.items);
  let playlistArtists = [];
  for (let i = 0; i < tracks.length; i++) {
    //get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(tracks[i].track.artists)
    playlistArtists.push(artists);

    //get artist ids for a track
    const artistIds = [];
    artists.forEach(artist => {
      artistIds.push(artist.id);
    });

    //sets following to true if all the artists are followed
    tracks[i].track.following = !((await spotifyApi.isFollowingArtists(artistIds)).body.includes(false));
  };



  res.render('playlistDetail', {
    title: 'Playlist Detail View',
    tracks,
    userid,
    playlistArtists,
  });
  // res.json(tracks);
};
