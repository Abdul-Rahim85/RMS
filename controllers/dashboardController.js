const Item = require('../models/Item');

const dashboard_get = (req, res) => {
  res.render('dashboard/index', { title: 'Dashboard' });
}

const items_get = (req, res) => {
  res.render('dashboard/items', { title: 'Items' });
}

const items_post = (req, res) => {    
  try {

    const { itemName, itemCategory, itemPrice } = req.body;
    if (!itemName || !itemCategory || !itemPrice) {
      return res.status(400).json({ error: 'Please fill all required fields' });

    } else {
      const newItem = new Item({
        name: itemName,
        category: itemCategory,
        price: itemPrice,
        imageUrl: req.file ? "/uploads/" + req.file.filename : null

      });
      newItem.save();
      res.status(201).json({ message: "Item added successfully", item: newItem });
    }

  }catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

const reports_get = (req, res) => {
  res.render('dashboard/reports', { title: 'Reports' });
}

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