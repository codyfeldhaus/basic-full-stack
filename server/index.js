//required modules/imports
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config()

//initial express app
const app = express();

//setup middleware
app.use(cors());

//use Pool from pg package to create database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'basic_full_stack',
  password: process.env.DB_PASSWORD,
  port: 5433 //yours should probably be 5432
});

//get request handler for search
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q.toLowerCase(); //eg: /search?q=Smith
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = $1', [`${searchQuery}`]);
    //const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = $1', ['smith']);
    //const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = 'smith');  
    res.json(rows);
  } catch (error) {
    res.status(500).send(error);
  }
})

//start our server at given port
const PORT = process.env.PORT || 3001; //use port specificied in .env if there is one, default to 3001 otherwise
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})