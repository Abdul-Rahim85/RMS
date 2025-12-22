const fs = require("fs");
const path = require("path");
const Item = require('../models/Item');

// Items Controller get all items
const items_get = async (req, res) => {  
  const itemList = await Item.find();
  
  res.render('dashboard/items', { title: 'Items', items: itemList });
}

// Get single item by ID
const item_get = async (req, res) => {  
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }   
    res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  } 
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

// Handle item update
const item_patch = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { itemName, itemCategory, itemPrice } = req.body;   
    const item = await Item.findById(itemId);
    if (!item) {  
      return res.status(404).json({ error: 'Item not found' });
    }
    // Update fields
    item.name = itemName || item.name;
    item.category = itemCategory || item.category;
    item.price = itemPrice || item.price;
    // If new image uploaded, update imageUrl
    if (req.file) {
      
      // Delete old image if exists 
      if (item.imageUrl) {
        const oldImageFullPath = path.join(__dirname, "../", "public", item.imageUrl);
        fs.unlink(oldImageFullPath, (err) => {
          if (err) console.log("Failed to delete old image:", err);
          else console.log("Old image deleted:", oldImageFullPath);
        });
      }
      item.imageUrl = "/image/itemsimage/" + req.file.filename;
    }
    await item.save();
    res.status(200).json({ message: 'Item updated successfully', item });   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  } 
}


module.exports = {
  items_get,
  item_get,
  items_post,
  item_patch,
  items_delete
}