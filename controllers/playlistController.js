exports.getPlaylists = async (req, res) => {
  const currentUserId = req.params.userid;
  const page = req.params.page || 0;
  const countPerPage = 6;
  const currentUserPlaylists = await req.spotifyApi.getUserPlaylists(
    currentUserId,
    {
      limit: countPerPage,
      offset: page * countPerPage
    }
  );
  const pages = Math.ceil(currentUserPlaylists.body.total / countPerPage);
  const currentUserPlaylistsThisPage = Array.from(
    currentUserPlaylists.body.items
  );

  const pagePlaylists = [];
  for (let i = 0; i < countPerPage; i++) {
    if (currentUserPlaylistsThisPage[i]) {
      currentUserPlaylistsThisPage[
        i
      ].artistIds = await getArtistIdsFromPlaylist(
        currentUserPlaylistsThisPage[i],
        req
      );
      currentUserPlaylistsThisPage[
        i
      ].numberFollowing = await getNumberofArtistsFollowing(
        currentUserPlaylistsThisPage[i].artistIds,
        req
      );
      pagePlaylists.push(currentUserPlaylistsThisPage[i]);
    }
  }

  res.render("playlists", {
    title: "Here's your playlists.",
    pages,
    page,
    playlists: pagePlaylists,
    currentUser: currentUserId
  });
};

exports.followPlaylistArtists = async (req, res) => {
  const playlistid = req.params.playlistid;
  const ownerid = req.params.ownerid;
  const userid = req.params.userid;
  const refpage = req.params.refpage;
  const totalArtists = req.params.artisttotal;
  const playlistArtistIds = [];
  let items = [];

  for (let i = 0; i < totalArtists; i += 100) {
    const itemsSub = Array.from(
      (await req.spotifyApi.getPlaylistTracks(
        req.params.ownerid,
        req.params.playlistid,
        {
          offset: i,
          fields: "items.track(artists.id)"
        }
      )).body.items
    );
    items = items.concat(itemsSub);
  }

  // console.log(JSON.stringify(items));

  for (let i = 0; i < items.length; i++) {
    // get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(items[i].track.artists);
    artists.forEach(artist => {
      playlistArtistIds.push(artist.id);
    });
  }

  // split artists into chunks to check for following
  let i,
    j,
    temparray,
    chunk = 50;
  for (i = 0, j = playlistArtistIds.length; i < j; i += chunk) {
    temparray = playlistArtistIds.slice(i, i + chunk);
    await req.spotifyApi.followArtists(temparray.filter(n => n));
  }

  res.redirect(`/${userid}/playlists/page/${refpage}`);
};

exports.getPlaylistArtists = async (req, res) => {
  const playlistid = req.params.playlistid;
  const ownerid = req.params.ownerid;
  const tracks = Array.from(
    (await req.spotifyApi.getPlaylistTracks(
      req.params.ownerid,
      req.params.playlistid,
      {
        fields: "items.track(name,artists)"
      }
    )).body.items
  );

  for (let i = 0; i < tracks.length; i++) {
    // get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(tracks[i].track.artists);

    // get artist ids for a track
    const artistIds = [];
    artists.forEach(artist => {
      artistIds.push(artist.id);
    });

    // sets following to true if all the artists are followed
    tracks[i].track.following = !(await req.spotifyApi.isFollowingArtists(
      artistIds
    )).body.includes(false);
  }

  res.render("playlistDetail", {
    title: "Playlist Detail View",
    tracks
  });
};

async function getArtistIdsFromPlaylist(playlist, req) {
  const tracks = Array.from(
    (await req.spotifyApi.getPlaylistTracks(playlist.owner.id, playlist.id, {
      fields: "items.track(artists)"
    })).body.items
  );
  const playlistArtistIds = [];

  for (let i = 0; i < tracks.length; i++) {
    // get all the artists in a track and push the entire artist object to playlist artists for total follow
    const artists = Array.from(tracks[i].track.artists);
    // get artist ids for a track
    const artistIds = [];
    artists.forEach(artist => {
      playlistArtistIds.push(artist.id);
    });
  }

  return playlistArtistIds;
}

async function getNumberofArtistsFollowing(artistIds, req) {
  let numberFollowing = 0;

  // split artists into chunks to check for following
  let i,
    j,
    temparray,
    chunk = 50;
  for (i = 0, j = artistIds.length; i < j; i += chunk) {
    temparray = artistIds.slice(i, i + chunk);

    // black magic to remove errant null ids
    const artists = (await req.spotifyApi.isFollowingArtists(
      temparray.filter(n => n)
    )).body;
    for (let i = 0; i < temparray.length; i++) {
      if (artists[i]) {
        numberFollowing++;
      }
    }
  }

  return numberFollowing;
}

function removeDuplicates(num) {
  let x,
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
