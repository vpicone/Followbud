exports.getTools = (req, res) => {
  res.render('tools', {
    title: 'Followfy - Tools'
  });
};

exports.homePage = (req, res) => {
  res.render('playlists', {
    title: 'Followfy - Home'
  });
};
