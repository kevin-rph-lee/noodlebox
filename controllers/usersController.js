const db = require("../lib/dbConnect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



//Checks for valid email
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//Update the refresh token in the DB when a user logs in
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

        res.json({role, accessToken, userName });
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
  let SQLStringUpdateRefreshToken = `UPDATE users SET refresh_token  = NULL WHERE refresh_token = $1;`
  let updateRefreshTokenValues =  [refreshToken]
  try{
    await db.query(SQLStringUpdateRefreshToken, updateRefreshTokenValues)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
  } catch (err) {
    console.log('Error updating refresh token to NULL! ' + err)
    res.sendStatus(500)
  }
}

const registerUser = async (req, res) => {
  //Checking if either password or username is empty
  if(req.body.username.length === 0 || req.body.password.length === 0){
    console.log('Must enter both email and password to login')
    res.status(500).send('Must enter both email and password to login')
    return;
  } else if(req.body.password.length < 5) {
    console.log('Password too short')
    res.status(500).send('Password length insufficient')
    return;
  } else if(!validateEmail(req.body.username)){
    console.log('Username not email')
    res.status(500).send('Username must be an email format')
    return;
  } else {
    const username = req.body.username.trim().toLowerCase().toString();
    const password = bcrypt.hashSync(req.body.password, 10)

    let SQLStringCheckUser = `SELECT * FROM users WHERE user_name = $1;`
    let valuesCheckUser =  [username]
    //Checks if the user exists, if it does, checks if password is correct. If correct, sets a cookie session in the browser and logs the user in. 
    db.query(SQLStringCheckUser, valuesCheckUser)
      .then(async (data) => {
  
        if(data['rowCount'] === 1){
          console.log('User already exists!')
          res.status(500).send('Username already registered!')
        } else if((data['rowCount'] > 1)) {
          console.log('DB eror')
          res.status(500).send('Internal Database Error! Please contact your system administrator')
        } else {
          
          try {
            let SQLStringRegisterUser = `INSERT INTO users (user_name, password, role, refresh_token) VALUES ($1, $2, 'user', NULL) RETURNING id, user_name, role;`
            let valuesRegisterUser=  [username, password]
            const userResults = await db.query(SQLStringRegisterUser, valuesRegisterUser)
            const userID = userResults['rows'][0]['id']
            const userName = userResults['rows'][0]['user_name']
            const role = userResults['rows'][0]['role']
            const accessToken = jwt.sign(
              {
                "userID": userID,
                "userName": userName,
                "role": 'user'
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '900s' }
            );
  
            const refreshToken = jwt.sign(
              { "userName": userName },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: '1d' }
            );

            updateRefreshToken(refreshToken, userID)

            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

            res.json({role, accessToken, userName });

          } catch (error) {
            console.log(`Database Error! ${error}`)
            res.status(500).send('Internal Database Error! Please contact your system administrator')
          }
        }
      })
  }

}


const updatePasswordAdmin = async (req, res) => {
  if(req.body.newUserPassword !== req.body.newUserPasswordConfirm){
    res.status(500).send('Passwords do not match!')
  } else if(req.body.newUserPassword.length < 5){
    res.status(500).send('Password length too low!')
  } else{
    let SQLStringCheckUser = `SELECT * FROM users WHERE user_name = $1;`
    let valuesCheckUser =  [req.user]

    db.query(SQLStringCheckUser, valuesCheckUser)
      .then(async (data) => {
        console.log(req.body.updatePasswordAdmin)
        console.log(data['rows'][0]['password'])
        if(data['rowCount'] !== 1){
          console.log('DB Error!')
          res.status(500).send('Database error, please contact your system administrator!')
        } else if(bcrypt.compareSync(req.body.adminPassword, data['rows'][0]['password'])){
          try{
            let SQLStringUpdateUserPass = `UPDATE users SET password = $1 where user_name = $2;`
            let valuesUpdateUserPass = [ bcrypt.hashSync(req.body.newUserPassword, 10),req.body.userToUpdate]
            await db.query(SQLStringUpdateUserPass, valuesUpdateUserPass)
            res.sendStatus(200)
          } catch {
            res.status(500).send('DB error! Please contact your system administrator')
          }
        } else {
          res.status(500).send('Invalid Admin password! Remember to enter your own password')
        }
    })
  }




}



module.exports = {
    getUsers,
    loginUser,
    logoutUser,
    registerUser,
    updatePasswordAdmin
}
