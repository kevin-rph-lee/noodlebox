const express = require('express');
const router  = express.Router();
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

module.exports = () => {

  router.route('/')
    .get(verifyJWT, usersController.getUsers)

  router.post("/login", (req, res) => {
    usersController.loginUser(req,res)
  });

  router.post("/register", (req, res) => {
    usersController.registerUser(req,res)
  });

  router.post("/logout", (req, res) => {
    usersController.logoutUser(req,res)
  });
 
  return router;
};