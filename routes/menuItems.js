const express = require('express');
const router  = express.Router();
const menuItemsController = require('../controllers/menuItemsController')

module.exports = () => {

  //Get menu items
  router.route('/')
    .get(menuItemsController.getMenuItems)  
  
  return router;
};