const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // console.log('Running verifyJWT')
    const authHeader = req.headers['authorization'];
 
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    // console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.userName;
            req.role = decoded.role;
            next();
        }
    );
}

module.exports = verifyJWT