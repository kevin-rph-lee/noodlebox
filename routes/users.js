const express = require('express');
const router  = express.Router();
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');

module.exports = () => {

  router.route('/')
    .get(verifyJWT, verifyRoles('admin'), usersController.getUsers)

  router.route('/update/admin')
    .post(verifyJWT, verifyRoles('admin'), usersController.updatePasswordAdmin)


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