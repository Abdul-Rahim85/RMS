const Item = require('../models/Item');
const Order = require('../models/order');

// Dashboard Controller
const dashboard_get = async (req, res) => {
  try {
    // Fetch items categorized
    const meals = await Item.find({ category: "meals" });
    const drinks = await Item.find({ category: "drinks" });
    const desserts = await Item.find({ category: "desserts" });

    // Calculate reports data
    const { totalItemsSold, totalSales, bestSellingItem } = await calculateReports();
    
    // Render dashboard with fetched data
    res.render('dashboard/index', 
      { title: 'Dashboard', 
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
      const {totalItemsSold, totalSales, bestSellingItem } = await calculateReports();      
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


// Reports Controller
const reports_get = (req, res) => {
  res.render('dashboard/reports', { title: 'Reports' });
}

// Settings Controller
const settings_get = (req, res) => {
  res.render('dashboard/settings', { title: 'Settings' });
}


// Helper function to calculate reports
async function calculateReports() {
  // Initialize report variables
  let allItems = [], totalItemsSold = 0, totalSales = 0, bestSellingItem = '';    

  // Define start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // today at 00:00:00

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // today at 23:59:59


  // Fetch orders if needed (not used in current view)
  const orders = await Order.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ createdAt: -1 });

  // Cycle through orders to aggregate item quantities 
  orders.forEach(order => {
    let oneOrderItems = order.items;

    // Assuming order.items is an array of item references with quantity
    oneOrderItems.forEach(item => {

      if(allItems.length === 0) {
        allItems.push({ name: item.name, quantity: item.count});
        return;
      }
      for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].name === item.name) {
          allItems[i].quantity += item.count;
          break;

        } else if (i === allItems.length - 1) {
          allItems.push({ name: item.name, quantity: item.count});
          break
        }
      }
    });
  });

  // Determine best-selling item
  if(allItems.length > 0){
    bestSellingItem = allItems.reduce((max, item) => {
    return item.quantity > max.quantity ? item : max;
    }, { name: '', quantity: 0 }).name;
  }
  
  // Calculate total items sold and
  if(allItems.length > 0){
    totalItemsSold = allItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  }

  // Calculate total sales
  if(orders.length > 0) {
    totalSales = orders.reduce((sum, order) => {
    return sum + order.totalAmount;
  }, 0);
  }
  return { totalItemsSold, totalSales, bestSellingItem };
}

module.exports = {
  dashboard_get,
  order_print_post,
  reports_get,
  settings_get
}