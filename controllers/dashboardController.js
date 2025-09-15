const dashboard_get = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
}

module.exports = {
  dashboard_get
}