const db = require("../lib/dbConnect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



//Checks for valid email
function validateEmail (email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

updateRefreshToken = (refreshToken, userID) =>{
  let SQLStringUpdateRefreshToken = `UPDATE users SET refresh_token = $1 where id = $2;`
  let valuesUpdateRefreshToken =  [refreshToken, userID]
  db.query(SQLStringUpdateRefreshToken, valuesUpdateRefreshToken)
  .then(data => {
   
  })

}


const getUsers = async (req, res) => {

    let userID = req.body.userID
    let SQLStringGetUser = `SELECT id, user_name, role FROM users;`

    db.query(SQLStringGetUser)
    .then(data => {
      res.json(data.rows)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
    
}

const loginUser = async (req, res) => {

  //Checking if either password or username is empty
  if(req.body.username.length === 0 || req.body.password.length === 0){
    console.log('Must enter both email and password to login')
    res.status(500).send('Must enter both email and password to login')
    return;
  }

  const username = req.body.username.trim().toLowerCase().toString();
  const password = req.body.password

  // Checking if the email is valid
  if (!validateEmail(username)){
    console.log('Invalid email Format')
    res.status(500).send('Invalid email Format')
    return;
  }

  //Query strings for DB
  let SQLStringCheckUser = `SELECT * FROM users WHERE user_name = $1;`
  let valuesCheckUser =  [username]

  //Checks if the user exists, if it does, checks if password is correct. If correct, sets a cookie session in the browser and logs the user in. 
  db.query(SQLStringCheckUser, valuesCheckUser)
    .then(async (data) => {

      if(data['rowCount'] == 0){
        console.log('Invalid username or password!')
        res.status(500).send('Invalid username or password!')
      } else if((data['rowCount'] > 1)) {
        console.log('DB eror')
        res.status(500).send('Internal Database Error! Please contact your system administrator')
      } else if(bcrypt.compareSync(password, data['rows'][0]['password'])){
        console.log('Login Successful')
        const userID = data['rows'][0]['id']
        const userName = data['rows'][0]['user_name']
        const role = data['rows'][0]['role']

        const accessToken = jwt.sign(
          {
            "userID": userID,
            "userName": userName,
            "role": role
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '900s' }
        );

        const refreshToken = jwt.sign(
          { "userName": data['rows'][0]['user_name'] },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );

        await updateRefreshToken(refreshToken, data['rows'][0]['id'])
 
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({role, accessToken });
      } else if(!bcrypt.compareSync(password, data['rows'][0]['password'])){
        console.log('Invalid username or password!')
        res.status(500).send('Invalid username or password!')
      } else {
        console.log('Other error')
        res.status(500).send('Internal Error! Please contact your system administrator')
      }
    })
    .catch(err => {
      console.log('Other error')
      console.log(err.message)
      res
        .status(500)
        .json({ error: err.message });
    });
}

const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  let SQLStringUpdateRefreshToken = `UPDATE SET refreshToken = NULL FROM users WHERE refreshToken = $1;`
  let updateRefreshTokenValues =  [refreshToken]
  try{
    await db.query(SQLStringUpdateRefreshToken, updateRefreshTokenValues)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
  } catch {
    console.log('Cannot find refresh token!')
    res.sendStatus(500)
  }
}


module.exports = {
    getUsers,
    loginUser,
    logoutUser
}
