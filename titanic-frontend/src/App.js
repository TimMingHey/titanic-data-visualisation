import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from './components/Table';
import Graph from './components/Graph';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, fetch the data from /api/fetch-data
    axios.get('http://localhost:5000/api/fetch-data')
      .then((res) => {
        console.log('Data imported successfully:', res.data);
        
        // After the fetch-data call is successful, now fetch passengers
        return axios.get('http://localhost:5000/api/passengers');
      })
      .then((res) => {
        setPassengers(res.data); // Set the passengers' data after it is fetched
        setLoading(false); // Stop the loading state once data is fetched
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false); // Stop loading even on error
      });
  }, []); // Empty dependency array, meaning this effect will run once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show a loading message until data is ready
  }

  return (
    <div>
      <h1>Titanic Data Visualization</h1>
      <Graph data={passengers} />
      <Table data={passengers} />
    </div>
  );
};

export default App;
