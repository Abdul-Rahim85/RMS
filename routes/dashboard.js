const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const dashboardRoute = express.Router();

dashboardRoute.get('/', dashboardController.dashboard_get);
dashboardRoute.get('/stats', dashboardController.statistics_get);
dashboardRoute.get('/settings', dashboardController.settings_get);

module.exports = dashboardRoute;