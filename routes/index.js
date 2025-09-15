const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const dashboardRoute = express.Router();

dashboardRoute.get('/', dashboardController.dashboard_get);

module.exports = dashboardRoute;