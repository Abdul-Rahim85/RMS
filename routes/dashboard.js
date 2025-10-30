const express = require('express');
const upload = require('../middlewares/upload');
const dashboardController = require('../controllers/dashboardController');

const dashboardRoute = express.Router();

dashboardRoute.get('/', dashboardController.dashboard_get);
dashboardRoute.get('/items', dashboardController.items_get);
dashboardRoute.post('/items', upload.single('itemImage'), dashboardController.items_post);
dashboardRoute.post('/order-print', dashboardController.order_print_post);
dashboardRoute.get('/reports', dashboardController.reports_get);
dashboardRoute.get('/settings', dashboardController.settings_get);

module.exports = dashboardRoute;