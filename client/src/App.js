
//useState - search term, results
//map results to our list
//key (item id)
//onChange for the search term

import React, { useState } from 'react';

function App() {
  //create state variables for searchTerm and results
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  //create state variables for storing user entered username and password
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  //create state variable to store auth token and logged in status
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //create state variable to keep track of whether or not user is trying to register
  const [isRegistering, setIsRegistering] = useState(false);

  //handler for onClick
  const handleSearch = async () => {
    //use fetch to call server API to search DB for given last name
    const response = await fetch(`http://localhost:3001/search?q=${searchTerm}`);
    //convert the response to json and store in variable
    const data = await response.json();
    //set the results to be the json data
    setResults(data)
  }

  //handleLogin
  const handleLogin = async () => {
    //try logging in
    try {
      //send post request to /login route with the username and password in the body
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) //{username: _______, password: ________}
      });
      //check if fetch was successful 
      if (response.ok) {
        // const data = await response.json();
        // setToken(data.token)

        //extracting the token from the response and setting the token and isLoggedIn state variable
        const { token } = await response.json();
        setToken(token);
        setIsLoggedIn(true);
        alert("Login succeeded! Welcome back!");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      alert('An error occurred while logging in.');
    }
  }

  return (
    <div>
      <h1>Basic Full Stack - Last Name DB Search</h1>


      {/* UI for log in form */}

      {!isLoggedIn ? (
      <div>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type='text'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />      

        <button onClick={handleLogin}>Log In</button>
      </div>) : (
        <p>You are logged in!</p>
      )}
      
      


      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* onClick for button */}
        <button onClick={handleSearch}>Search</button> 
      </div>

      <h2>Results</h2>
      <ul>
        {/* Code to render results here */}
        {results.map(result => (
          <li key={result.id}>{result.first_name ? result.first_name : "NULL"} {result.last_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
