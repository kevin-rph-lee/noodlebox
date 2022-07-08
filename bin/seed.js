const { Pool } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config();

//Loading DB setup parameters
const dbParams = require('../lib/db.js');
const db = new Pool(dbParams);

db.connect();

let SQLStringInsertUsersSeed = `INSERT INTO users(user_name, password, role, refresh_token) 
                            VALUES($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12), ($13, $14, $15, $16);`

//Creating 4 users from the env file
let valuesInsertUsersSeed =  ['admin@admin.com', bcrypt.hashSync(process.env.ADMIN_PASS, 10), 'admin', null, 
                          'user1@user.com', bcrypt.hashSync(process.env.USER1_PASS, 10), 'user', null,
                          'user2@user.com', bcrypt.hashSync(process.env.USER2_PASS, 10), 'user', null,
                          'user3@user.com', bcrypt.hashSync(process.env.USER3_PASS, 10), 'user', null]

let SQLStringInsertMenuItemsSeed = `INSERT INTO menu_items(item_name, item_type, item_price, item_picture, item_description) 
                          VALUES('Chow-mein', 'noodle', 12, 'test', 'Crispy chow mein with seafood and vegetables'), 
                          ('Pho', 'noodle', 15, 'test', 'Beef pho'), 
                          ('Ramen', 'noodle', 17, 'test', 'Tonkatsu Ramen'),
                          ('Wonton Noodle', 'noodle', 14, 'test', 'With shrimp and pork wontons'),
                          ('Gyoza', 'snack', 6, 'test', 'Pork and vegetable pan fried gyoza'), 
                          ('Spring roll', 'snack', 5, 'test', 'Vegetable spring rolls'),
                          ('Satay', 'snack', 6.5, 'test', 'Beef satay skewers'), 
                          ('Bubble Tea', 'drink', 4.5, 'test', 'Ask server for available flavours'), 
                          ('Viet Coffee', 'drink', 4, 'test', 'Extra strong');`

let SQLStringInsertOrdersSeed = `INSERT INTO orders(user_ID, order_completion) 
                          VALUES(2, false),
                          (3, true)`

let SQLStringInsertOrderedItemsSeed = `INSERT INTO ordered_items(order_id, menu_item_id, quantity) 
                          VALUES(1,1,1),
                          (1,2,2),
                          (1,3,2),
                          (2,4,4),
                          (2,2,1)`


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

function seedMenuItems(){
  return new Promise((resolve) =>{
    db.query(SQLStringInsertMenuItemsSeed)
    .then( () => {
      console.log('Menu Item seed successful')
      resolve()
    }).catch(err => {
      console.log('ERROR: ')
      console.log(err)
    });
  })
}


function seedOrders(){
  return new Promise((resolve) =>{
    db.query(SQLStringInsertOrdersSeed)
    .then( () => {
      console.log('Orders seed successful')
      resolve()
    }).catch(err => {
      console.log('ERROR: ')
      console.log(err)
    });
  })
}


function seedOrderedItems(){
  return new Promise((resolve) =>{
    db.query(SQLStringInsertOrderedItemsSeed)
    .then( () => {
      console.log('Ordered Items seed successful')
      resolve()
    }).catch(err => {
      console.log('ERROR: ')
      console.log(err)
    });
  })
}

async function seedData() {
  await seedUsers();
  await seedMenuItems();
  await seedOrders();
  await seedOrderedItems();
  db.end();
  console.log('Seeds successful')
  return;
}

seedData()