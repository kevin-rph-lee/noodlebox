const db = require('../lib/dbConnect');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
 
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    let SQLStringUpdateRefreshToken = `SELECT id, user_name, role, refresh_token from users WHERE refresh_token = $1`
    let valuesUpdateRefreshToken =  [refreshToken]
    db.query(SQLStringUpdateRefreshToken, valuesUpdateRefreshToken)
    .then(data => {
        if (data.rows.length !== 1) {
            console.log('DB Error!')
            return res.sendStatus(500)
        }
        
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || data.rows[0]['user_name'] !== decoded['userName']) {

                    return res.sendStatus(403);
                }
                let userID = data['rows'][0]['id']
                let userName = data['rows'][0]['user_name']
                let role = data['rows'][0]['role']

                const accessToken = jwt.sign(
                    {
                        'userID': userID,
                        'userName': userName,
                        'role': role
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '900s' }
                );

                res.json({ accessToken, role, userName })
            }
        );
    })



}

module.exports = { handleRefreshToken }