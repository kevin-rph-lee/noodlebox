const express = require('express');
const router  = express.Router();
const ordersController = require('../controllers/ordersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');


module.exports = () => {

  //Get order
  router.route('/')
    .get(verifyJWT, verifyRoles('user', 'admin'),ordersController.getOrders)  

  //Get pending order
  router.route('/pending')
    .get(verifyJWT, verifyRoles('user', 'admin'),ordersController.getPendingOrders)  

  //Get pending order
  router.route('/finished')
    .get(verifyJWT, verifyRoles('user', 'admin'),ordersController.getFinishedOrders)  

  //Get all order
  router.route('/admin')
    .get(verifyJWT, verifyRoles('admin'),ordersController.getAllOrders)  

  //Create order
  router.route('/')
    .post(verifyJWT, verifyRoles('user', 'admin'), ordersController.createOrder)  
  
  router.route('/complete')
    .post(verifyJWT, verifyRoles('admin'), ordersController.completeOrder)  
  
  return router;
};



