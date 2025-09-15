const dashboard_get = (req, res) => {
  res.render('./dashboard/index', { title: 'Dashboard' });
}

const statistics_get = (req, res) => {
  res.render('./dashboard/stats', { title: 'Statistics' });
}

const settings_get = (req, res) => {
  res.render('./dashboard/settings', { title: 'Settings' });
}

module.exports = {
  dashboard_get,
  statistics_get,
  settings_get
}