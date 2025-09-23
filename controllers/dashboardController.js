const dashboard_get = (req, res) => {
  res.render('dashboard/index', { title: 'Dashboard' });
}

const items_get = (req, res) => {
  res.render('dashboard/items', { title: 'Items' });
}

const reports_get = (req, res) => {
  res.render('dashboard/reports', { title: 'Reports' });
}

const settings_get = (req, res) => {
  res.render('dashboard/settings', { title: 'Settings' });
}

module.exports = {
  dashboard_get,
  items_get,
  reports_get,
  settings_get
}