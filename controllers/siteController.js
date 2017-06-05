exports.getTools = (req, res) => {
  res.render('tools', {
    title: 'Followbud - Tools'
  });
};

exports.homePage = (req, res) => {
  res.render('playlists', {
    title: 'Followbud - Home'
  });
};
