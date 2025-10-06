const Item = require('../models/Item');

// Dashboard Controller
const dashboard_get = async (req, res) => {
  try {
    const items = await Item.find();      
    res.render('dashboard/index', { title: 'Dashboard', items });
              
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  reports_get,
  settings_get
}