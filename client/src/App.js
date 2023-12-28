
//useState - search term, results
//map results to our list
//key (item id)
//onChange for the search term

import React, { useState } from 'react';

function App() {
  //create state variables for searchTerm and results
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  //handler for onClick
  const handleSearch = async () => {
    //use fetch to call server API to search DB for given last name
    const response = await fetch(`http://localhost:3001/search?q=${searchTerm}`);
    //convert the response to json and store in variable
    const data = await response.json();
    //set the results to be the json data
    setResults(data)
  }

  return (
    <div>
      <h1>Basic Full Stack - Last Name DB Search</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* onClick for button */}
      <button onClick={handleSearch}>Search</button> 

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
