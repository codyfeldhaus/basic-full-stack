//required modules/imports
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

//initial express app
const app = express();

//setup middleware
app.use(cors()); //middleware for allowing cross-origin resource sharing (eg. letting our client and server communicate)
app.use(express.json()); //built in middleware for parsing JSON sent in requests

//use Pool from pg package to create database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'basic_full_stack',
  password: process.env.DB_PASSWORD,
  port: 5433 //yours should probably be 5432
});

//authentication middleware
const authenticateToken = (req, res, next) => {
  //get the token from the authorization header
  const authHeader = req.headers['authorization'];
  // let token = null;
  // if (authHeader) {
  //   token = authHeader.split(' ')[1]; //"Bearer djahdskahjdsfhajsdkfhaksdfhakjdsfahk" -> ["Bearer", "kdasdjfaadsfd"]
  // }

  const token = authHeader ? authHeader.split(' ')[1] : null;

  // const token = authHeader && authHeader.split(' ')[1];

  // const token = authHeader?.split(' ')[1];


  //if no token provided, return 401 Unauthorized
  if (!token) {
    res.status(401).send();
    // res.sendStatus(401);
  }

  //verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //if verify fails
    if (err) {
      res.sendStatus(403) //if token not valid, send 403 Forbidden
    }
    //store the user in a property called user in the request object
    req.user = user;
    //proceed to the next middleware/route in the chain
    next();
  })
}


//only want users to be able to search our name db if they are authenticated
//get request handler for search only if authenticateToken middleware passes
app.get('/search', authenticateToken, async (req, res) => {
  try {
    const searchQuery = req.query.q.toLowerCase(); //eg: /search?q=Smith
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = $1', [`${searchQuery}`]);
    //const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = $1', ['smith']);
    //const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(last_name) = 'smith');  
    res.json(rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

//post request handler for registration
app.post('/register', async (req, res) => {
  //extracting the username and password from the body of the request object using destructuring
  const { username, password } = req.body;
  //use bcrypt to create an encrypted hash of the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //insert the new user into the registration table
  try {
    //query the database to insert into the registrations table
    await pool.query('INSERT INTO registrations (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//post request handler for login
app.post('/login', async (req, res) => {
  //extracting the username and password from the body of the request object using destructuring
  const { username, password } = req.body;

  try {
    //check if user exists
    const { rows } = await pool.query('SELECT * FROM registrations WHERE username = $1', [username]); //get row with matching username, if it exists
    //check if more than 0 matching rows
    if (rows.length > 0) {
      //if so, a user with given username does in fact exist in our table
      //check if their password matches
      const isValid = await bcrypt.compare(password, rows[0].password);//store the boolean result of bcrypt's compare method in a variable

      if (isValid) {
        //if username and password combo are valid
        //create a JWT token
        const token = jwt.sign(
          { username },
          process.env.JWT_SECRET,
          { expiresIn: '1h'}
        );
        res.json({ token });
      } else {
        //if username and password combo NOT valid
        res.status(403).send('Invalid password');
      }
    } else {
      //if user does not exist
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
})

//start our server at given port
const PORT = process.env.PORT || 3001; //use port specificied in .env if there is one, default to 3001 otherwise
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})