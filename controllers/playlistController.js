exports.getPlaylists = async(req, res) => {
  const currentUserProfile = (await spotifyApi.getMe());
  const currentUserId = req.params.userid;
  const currentUserPlaylists = Array.from((await spotifyApi.getUserPlaylists(currentUserId)).body.items);
  const pages = Math.ceil(currentUserPlaylists.length / 3);
  const page = req.params.page || 0;
  const pagePlaylists = []

  console.log(pages);


  for (let i = page * 3; i < (page * 3) + 3; i++) {
    //const artistIdsWithDuplicates = removeDuplicates(artistIdsWithDuplicates);
    if (currentUserPlaylists[i]) {
      currentUserPlaylists[i].artistIds = await (getArtistIdsFromPlaylist(currentUserPlaylists[i]));
      //currentUserPlaylists[i].artistIds = removeDuplicates(currentUserPlaylists[i].artistIds);
      currentUserPlaylists[i].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[i].artistIds));
      pagePlaylists.push(currentUserPlaylists[i]);
    }
  }


  res.render('playlists', {
    title: `${currentUserProfile.body.display_name} - Playlists`,
    pages,
    page,
    playlists: pagePlaylists,
    currentUser: currentUserId,
  });
};

exports.followPlaylistArtists = async(req, res) => {
  const playlistid = req.params.playlistid;
  const ownerid = req.params.ownerid;
  const userid = req.params.userid;
  let playlistArtistIds = [];
  const items = Array.from((await spotifyApi.getPlaylistTracks(req.params.ownerid, req.params.playlistid, {
    "fields": "items.track(artists.id)"
  })).body.items);

  for (let i = 0; i < items.length; i++) {
    //get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(items[i].track.artists);
    artists.forEach(artist => {
      playlistArtistIds.push(artist.id);
    });
  };


  //split artists into chunks to check for following
  let i, j, temparray, chunk = 50;
  for (i = 0, j = playlistArtistIds.length; i < j; i += chunk) {
    temparray = playlistArtistIds.slice(i, i + chunk);
    await spotifyApi.followArtists(temparray.filter(n => n));
  }


  res.redirect(`/${userid}/playlists/`);
};


exports.getPlaylistArtists = async(req, res) => {
  const playlistid = req.params.playlistid;
  const ownerid = req.params.ownerid;
  const tracks = Array.from((await spotifyApi.getPlaylistTracks(req.params.ownerid, req.params.playlistid, {
    "fields": "items.track(name,artists)"
  })).body.items);

  for (let i = 0; i < tracks.length; i++) {
    //get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(tracks[i].track.artists)

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
  });
};

async function getArtistIdsFromPlaylist(playlist) {

  const tracks = Array.from((await spotifyApi.getPlaylistTracks(playlist.owner.id, playlist.id, {
    "fields": "items.track(artists)"
  })).body.items);
  let playlistArtistIds = [];

  for (let i = 0; i < tracks.length; i++) {
    //get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(tracks[i].track.artists)
    //get artist ids for a track
    const artistIds = [];
    artists.forEach(artist => {
      playlistArtistIds.push(artist.id);
    });
  };

  return playlistArtistIds;
};

async function getNumberofArtistsFollowing(artistIds) {


  //console.log(`BLANK SLOT HERE: ${artistIds.indexOf(null)}`);

  let numberFollowing = 0;

  //split artists into chunks to check for following
  let i, j, temparray, chunk = 50;
  for (i = 0, j = artistIds.length; i < j; i += chunk) {
    temparray = artistIds.slice(i, i + chunk);


    //black magic to remove errant null ids
    let artists = (await spotifyApi.isFollowingArtists(temparray.filter(n => n))).body;
    for (let i = 0; i < temparray.length; i++) {
      if (artists[i]) {
        numberFollowing++;
      };
    };
  }

  // console.log(`Number of artists: ${artists.length}`);
  // console.log(`Number following: ${numberFollowing}`);
  return numberFollowing;

};

function removeDuplicates(num) {
  var x,
    len = num.length,
    out = [],
    obj = {};

  for (x = 0; x < len; x++) {
    obj[num[x]] = 0;
  }

  for (x in obj) {
    out.push(x);
  }
  return out;
}
