const express = require('express');
const router  = express.Router();
const usersController = require('../controllers/usersController')

module.exports = () => {

  router.post("/login", (req, res) => {
    usersController.loginUser(req,res)
  });
 
  return router;
};