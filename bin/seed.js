const { Pool } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config();

//Loading DB setup parameters
const dbParams = require('../lib/db.js');
const db = new Pool(dbParams);

db.connect();

let SQLStringInsertUsersSeed = `INSERT INTO users(username, password, role, refreshToken) 
                            VALUES($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12), ($13, $14, $15, $16);`

//Creating 4 users from the env file
let valuesInsertUsersSeed =  ['admin@admin.com', bcrypt.hashSync(process.env.ADMIN_PASS, 10), 'admin', null, 
                          'user1@user.com', bcrypt.hashSync(process.env.USER1_PASS, 10), 'user', null,
                          'user2@user.com', bcrypt.hashSync(process.env.USER2_PASS, 10), 'user', null,
                          'user3@user.com', bcrypt.hashSync(process.env.USER3_PASS, 10), 'user', null]

function seedUsers(){
  return new Promise((resolve) =>{
    db.query(SQLStringInsertUsersSeed, valuesInsertUsersSeed)
    .then( () => {
      console.log('Users seed successful')
      resolve()
    }).catch(err => {
      console.log('ERROR: ')
      console.log(err)
    });
  })
}

async function seedData() {
  await seedUsers();
  db.end();
  console.log('Seeds successful')
  return;
}

seedData()