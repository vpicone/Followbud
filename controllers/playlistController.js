exports.getPlaylists = async(req, res) => {
  const currentUserProfile = (await spotifyApi.getMe());
  const currentUserId = req.params.userid;
  const currentUserPlaylists = Array.from((await spotifyApi.getUserPlaylists(currentUserId)).body.items);
  
  
  
  for(let i = 0; i < currentUserPlaylists.length; i++) {
    //get the artist Ids for a playlist
    //const artistIdsWithDuplicates = removeDuplicates(artistIdsWithDuplicates);
    currentUserPlaylists[i].artistIds = await (getArtistIdsFromPlaylist(currentUserPlaylists[i]));
    console.log("DUPLICATES?!?! " + removeDuplicates(currentUserPlaylists[i].artistIds));
    //currentUserPlaylists[i].artistIds = removeDuplicates(currentUserPlaylists[i].artistIds);
    currentUserPlaylists[i].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[i].artistIds));
  }
  
  
  // for(let i = 0; i < currentUserPlaylists.length; i++) {
  //   console.log(currentUserPlaylists[i].name);
  //   console.log(currentUserPlaylists[i].artistIds.length);
  //   currentUserPlaylists[i].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[i].artistIds));
  //   console.log(currentUserPlaylists[i].numberFollowing)
  // }
  
  // currentUserPlaylists[5].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[5].artistIds));
  // currentUserPlaylists[6].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[6].artistIds));
  // currentUserPlaylists[7].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[7].artistIds));
  // //currentUserPlaylists[3].numberFollowing = await (getNumberofArtistsFollowing(currentUserPlaylists[3].artistIds));
  
  
  
  for(let i = 0; i < currentUserPlaylists.length; i++) {
    console.log(currentUserPlaylists[i].name);
    console.log(currentUserPlaylists[i].artistIds.length);
    console.log(currentUserPlaylists[i].numberFollowing)
  }
  
  res.render('playlists', {
    title: `${currentUserProfile.body.display_name} - Playlists`,
    playlists: currentUserPlaylists,
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
  await spotifyApi.followArtists(playlistArtistIds);
  res.redirect('/playlists');
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
  let i,j,temparray,chunk = 25;
  for (i=0 ,j=artistIds.length; i < j; i+=chunk) {
    temparray = artistIds.slice(i, i+chunk);
    
    
    //black magic to remove errant null ids
    let artists = (await spotifyApi.isFollowingArtists(temparray.filter(n => n))).body;
    for(let i = 0; i < temparray.length; i++) {
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
  
  for (x=0; x<len; x++) {
    obj[num[x]]=0;
  }
  
  for (x in obj) {
    out.push(x);
  }
  return out;
}