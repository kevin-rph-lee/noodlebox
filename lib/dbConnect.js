
const { Pool } = require('pg');
const dbParams = require('./db.js');
 
 const pool = new Pool(dbParams);
 
 pool.on('connect', () => {
   console.log('Connecting to database');
 });
 
 module.exports = {
   query: (text, params) => pool.query(text, params),
 };





