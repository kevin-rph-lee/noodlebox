const express = require('express');
const router  = express.Router();
const ordersController = require('../controllers/ordersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');


module.exports = () => {

  //Get menu items
  router.route('/')
    .post(verifyJWT, verifyRoles('user', 'admin'), ordersController.createOrder)  
  
  return router;
};