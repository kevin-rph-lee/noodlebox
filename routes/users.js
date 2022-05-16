const express = require('express');
const router  = express.Router();
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');

module.exports = () => {

  //Get info for a single user
  router.route('/')
    .get(verifyJWT, verifyRoles('admin','user'), usersController.getUser)  
  
  //Get info for all users
  router.route('/all')
    .get(verifyJWT, verifyRoles('admin'), usersController.getUsers)

  //Admin updates the password for another user
  router.route('/update/admin')
    .post(verifyJWT, verifyRoles('admin'), usersController.updatePasswordAdmin)

  //User updates their own password
  router.route('/update/user')
    .post(verifyJWT, verifyRoles('admin', 'user'), usersController.updatePasswordUser)

  //Logging in a user
  router.post('/login', (req, res) => {
    usersController.loginUser(req,res)
  });

  //New user registration
  router.post('/register', (req, res) => {
    usersController.registerUser(req,res)
  });

  //Logout user
  router.post('/logout', (req, res) => {
    usersController.logoutUser(req,res)
  });

  return router;
};