const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

module.exports = () => {

    router.get('/', refreshTokenController.handleRefreshToken);
   
   
    return router;
};