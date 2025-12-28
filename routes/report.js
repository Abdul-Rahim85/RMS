const express = require('express');
const reportsController = require('../controllers/reportsController');

const reportsRoute = express.Router();

reportsRoute.get('/', reportsController.reports_get);

module.exports = reportsRoute;