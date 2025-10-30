const Item = require('../models/Item');
const Order = require('../models/order');

// Dashboard Controller
const dashboard_get = async (req, res) => {
  try {
    // Fetch items categorized
    const meals = await Item.find({ category: "meals" });
    const drinks = await Item.find({ category: "drinks" });
    const desserts = await Item.find({ category: "desserts" });
    let allItems = [];

    // Fetch orders if needed (not used in current view)
    const orders = await Order.find().sort({ createdAt: -1 });

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
    console.log(allItems);
    

    res.render('dashboard/index', { title: 'Dashboard', meals, drinks, desserts, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

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
      res.status(200).json({ message: 'Order received for printing' });
    }
    
  } catch (error) {
    console.error('Error in order_print_post:', error);
    res.status(500).json({ error: 'Failed to print order' });
  } 
}

// Items Controller
const items_get = (req, res) => {
  res.render('dashboard/items', { title: 'Items' });
}

// Handle item addition
const items_post = (req, res) => {    
  try {
    // Validate input
    const { itemName, itemCategory, itemPrice } = req.body;
    if (!itemName || !itemCategory || !itemPrice) {
      return res.status(400).json({ error: 'Please fill all required fields' });

    } else {
      const newItem = new Item({
        name: itemName,
        category: itemCategory,
        price: itemPrice,
        imageUrl: req.file ? "/image/itemsimage/" + req.file.filename : null

      });
      newItem.save();
      res.status(201).json({ message: "Item added successfully", item: newItem });
    }

  }catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
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

module.exports = {
  dashboard_get,
  items_get,
  items_post,
  order_print_post,
  reports_get,
  settings_get
}