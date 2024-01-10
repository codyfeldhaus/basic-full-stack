
import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    console.log("client token: ", token);
  }, [token]);

  //handler for onClick
  const handleSearch = async () => {
    //use fetch to call server API to search DB for given last name
    const response = await fetch(`http://localhost:3001/search?q=${searchTerm}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    //convert the response to json and store in variable
    const data = await response.json();
    //set the results to be the json data
    setResults(data)
  }


  //handleRegister
  const handleRegister = async () => {
    //try registering new user
    try {
      //send post request to /login route with the username and password in the body
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) //{username: _______, password: ________}
      });
      //check if fetch was successful 
      if (response.ok) {
        alert("Registration succeeded! Please log in to access.");
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      alert('An error occurred while registering.');
    }
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

      {/* This is a conditional rendering statement. 
        It checks the 'isLoggedIn' state. 
        If the user is not logged in (isLoggedIn is false), it shows the login/register form. 
        If the user is logged in (isLoggedIn is true), it shows the search interface. */}
      {!isLoggedIn ? (
      <div>
        {/* These are input fields for username and password. 
          'value' binds these inputs to the respective state variables (username, password).
          'onChange' updates the state with the current value in the input field. */}
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

        {/* These buttons are for triggering the register and login functionality. 
          'onClick' is set to the respective functions (handleRegister, handleLogin) 
          which handle the registration and login processes. */}
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Log In</button>

      </div>) : (
      <div>
        {/* This section is for the search functionality, displayed only when the user is logged in. */}
        <div>
          {/* This input field is for entering the search term. 
            It binds to the 'searchTerm' state and updates it as the user types. */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* This button triggers the search operation. 
            'onClick' is set to the handleSearch function 
            which handles the searching process. */}
          <button onClick={handleSearch}>Search</button> 
        </div>

        <h2>Results</h2>
        {/* This section renders the search results as a list. */}
        <ul>
          {/* The 'results' array from the component's state is mapped to list items. 
            Each result contains a first and last name. 
            If the first name is not present, "NULL" is displayed. */}
          {results.map(result => (
            <li key={result.id}>{result.first_name ? result.first_name : "NULL"} {result.last_name}</li>
          ))}
        </ul>
      </div>
      )}
      
    </div>
    
  )

}

export default App;
