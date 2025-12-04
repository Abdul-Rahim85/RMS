const express = require('express');
const upload = require('../middlewares/upload');
const itemController = require('../controllers/itemController');

const itemsRoute = express.Router();

itemsRoute.get('/', itemController.items_get);
itemsRoute.post('/', upload.single('itemImage'), itemController.items_post);
itemsRoute.get('/:id', itemController.item_get);
itemsRoute.patch('/:id', upload.single('itemImage'), itemController.item_patch);
itemsRoute.delete('/:id', itemController.items_delete);

module.exports = itemsRoute;