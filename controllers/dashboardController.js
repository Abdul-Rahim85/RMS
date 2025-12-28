const Item = require('../models/Item');
const Order = require('../models/order');
const { calculateReports } = require('./calculateReports');

// Dashboard Controller
const dashboard_get = async (req, res) => {
  try {
    // Fetch items categorized
    const meals = await Item.find({ category: "meals" });
    const drinks = await Item.find({ category: "drinks" });
    const desserts = await Item.find({ category: "desserts" });

    // Define start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // today at 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // today at 23:59:59

    // Calculate reports data
    const { totalItemsSold, totalSales, bestSellingItem } = await calculateReports(startOfDay, endOfDay);
    
    // Render dashboard with fetched data
    res.render('dashboard/index', 
      { title: 'لوحة التحكم', 
        meals, 
        drinks, 
        desserts, 
        reports: {
          totalItemsSold, 
          totalSales, 
          bestSellingItem
        } }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//This method handel the request of printing the order in the paper printer #######
const order_print_post = async (req, res) => {
  try {
    // Define start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // today at 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // today at 23:59:59

    const { orderItems, total } = req.body;   
    if(!orderItems || !total) {
      return res.status(400).json({ error: 'Invalid order data' });
    } else {
      const newOrder = new Order({
        items: orderItems,  
        totalAmount: total,
        createdAt: new Date() 
      });
      await newOrder.save();

      // Recalculate reports after new order
      const {allOrders, totalItemsSold, totalSales, bestSellingItem } = await calculateReports(startOfDay, endOfDay);      
      res.status(200).json({ message: 'Order received for printing', reports: {
          totalItemsSold, 
          totalSales, 
          bestSellingItem
        } });
    }
    
  } catch (error) {
    console.error('Error in order_print_post:', error);
    res.status(500).json({ error: 'Failed to print order' });
  } 
}

// Settings Controller
const settings_get = (req, res) => {
  res.render('dashboard/settings', { title: 'الإعدادات' });
}


// Helper function to calculate reports

module.exports = {
  dashboard_get,
  order_print_post,
  settings_get
}