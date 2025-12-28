const Order = require('../models/order');
const { calculateReports } = require('./calculateReports');

// Get Reports Page
const reports_get = async (req, res) => {
  // Calculate date range for the last 7 days
  const startday = new Date(); 
  const endday = new Date();
  const now = new Date(); // Current date and time

  // Set startday to 7 days ago at 00:00:00 and endday to today at 23:59:59
  startday.setHours(0, 0, 0, 0);
  startday.setDate(now.getDate() - 6); // 7 days ago
  
  // Set endday to today at 23:59:59
  endday.setHours(23, 59, 59, 999);
  endday.setDate(now.getDate());    

  const {allOrders, totalSales, bestSellingItem, averageSales, dailySales } = await calculateReports(startday, endday);

  res.render(
    'dashboard/reports',
    { 
      title: 'التقارير', 
      allOrders: allOrders.toLocaleString(), 
      totalSales: totalSales.toLocaleString(),
      bestSellingItem, 
      averageSales: averageSales.toLocaleString(),
      dailySales
    });
}

module.exports = {
  reports_get
};
