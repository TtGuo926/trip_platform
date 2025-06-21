// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'ls-89b3c600a4cd1583b786b344a5669ab2ddb45185.ch84iy4qaqq2.eu-central-1.rds.amazonaws.com', 
  port: 3306,                     
  user: 'dbmasteruser',                 
  password: 'uficyS-!SDn1wa{]2TMbl97%3&a|wR!c',           
  database: 'dbmaster' 
});

module.exports = pool;