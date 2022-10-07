const express = require('express');
const router  = express.Router();
const ordersController = require('../controllers/ordersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');


module.exports = () => {

  //Get order for a single user
  router.route('/')
    .get(verifyJWT, verifyRoles('user', 'admin'),ordersController.getOrders)  

  //Get order for a single user
  router.route('/completed')
    .get(verifyJWT, verifyRoles('user', 'admin'),ordersController.getCompletedOrders) 

  //Get order for a single user
  router.route('/pending')
    .get(verifyJWT, verifyRoles('user', 'admin'),ordersController.getPendingOrders)     

  //Get all orders
  router.route('/all')
    .get(verifyJWT, verifyRoles('admin'),ordersController.getAllOrders)  

  //Get all completed orders
  router.route('/completed/all')
    .get(verifyJWT, verifyRoles('admin'),ordersController.getAllCompletedOrders)  

  //Get all completed orders
  router.route('/pending/all')
    .get(verifyJWT, verifyRoles('admin'),ordersController.getAllPendingOrders)  

  //Complete order
  router.route('/complete')
    .post(verifyJWT, verifyRoles('user', 'admin'), ordersController.completeOrder)  

  //Create order
  router.route('/')
    .post(verifyJWT, verifyRoles('user', 'admin'), ordersController.createOrder)  


  
  return router;
};