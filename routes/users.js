const express = require('express');
const router  = express.Router();
const usersController = require('../controllers/usersController')

module.exports = () => {

  router.post("/", (req, res) => {
    usersController.test(req,res)
  });



 
  return router;
};