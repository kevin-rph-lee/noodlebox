const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

module.exports = () => {

    //Handling a request fo ra new refresh token
    router.get('/', refreshTokenController.handleRefreshToken);

    return router;
};