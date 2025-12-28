// All the falowing functions are use to calculate reports for different time periods
const Order = require('../models/order');

// Initialize report variables
let allItems = [], 
    dailySales = [], // For future use
    allOrders, // Total number of orders
    totalItemsSold = 0, // Total items sold
    totalSales = 0, // Total sales amount
    bestSellingItem = '', // Name of the best-selling item
    averageSales = 0; // Average sales amount

// Main function to calculate reports within a date range
async function calculateReports(startOfDate, endOfDate) {
  // Reset report variables before calculation
  resetReportVariables();

  // Fetch orders if needed (not used in current view)
  const orders = await Order.find({
    createdAt: { $gte: startOfDate, $lte: endOfDate }
  }).sort({ createdAt: -1 });

  // Calculate daily sales
  calcDailySales(orders);

  // Total number of orders
  allOrders = orders.length;

  // Calculate total items sold
  calcTotalItems(orders);

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

  // Calculate average sales
  if(allOrders > 0) {
    averageSales = Math.round(totalSales / allOrders);
  }
  return { allOrders, totalItemsSold, totalSales, bestSellingItem, averageSales, dailySales };
}

// Helper
function calcTotalItems(orders) {
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
}

// Helper to reset report variables
function resetReportVariables() {
  allItems = [];
  ordersNumbers = 0;
  totalItemsSold = 0;
  totalSales = 0;
  averageSales = 0;
  dailySales = [];
  bestSellingItem = '';
}

// Placeholder for daily sales calculation
function calcDailySales(orders) {
  const salesMap = new Map();

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const dateKey = orderDate.toLocaleDateString('ar-SA', {weekday: "long"}) // e.g., "الاثنين";

    if (salesMap.has(dateKey)) {
      salesMap.set(dateKey, salesMap.get(dateKey) + order.totalAmount);
    } else {
      salesMap.set(dateKey, order.totalAmount);
    } 
  });
  // Convert map to array of objects for easier handling
  salesMap.forEach((amount, day) => {    
    dailySales.push({ day, amount });
  });  
}

// Export the calculateReports function for use in other controllers
module.exports = {
  calculateReports
};