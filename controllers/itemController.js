const fs = require("fs");
const path = require("path");
const Item = require('../models/Item');

// Items Controller
const items_get = async (req, res) => {  
  const itemList = await Item.find();
  
  res.render('dashboard/items', { title: 'Items', items: itemList });
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

// Handle item deletion
const items_delete = async (req, res) => {
  try {
    const itemId = req.params.id;
    const  item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    } 

    // 2. Delete the image from server storage
    if (item.imageUrl) {

      const imageFullPath = path.join(__dirname, "../", "public", item.imageUrl);

      fs.unlink(imageFullPath, (err) => {
        if (err) console.log("Failed to delete image:", err);
        else console.log("Image deleted:", imageFullPath);
      });
    }

    // 3. Delete item from DB
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item deleted successfully' });    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  items_get,
  items_post,
  items_delete
}