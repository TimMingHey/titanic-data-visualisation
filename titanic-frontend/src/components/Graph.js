import React from 'react';
//Use recharts instead of chart.js-2 as there are a lot of errors when showing the chart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Graph = ({ data }) => {
    const chartData = data.reduce((acc, curr) => {
      const key = curr.Sex; // Use 'male' or 'female' from the Sex column
      acc[key] = acc[key] || { name: key, survivors: 0 }; // Initialize with survivors count
      if (curr.Survived === 1) {
        acc[key].survivors += 1; // Increment survivor count for the respective key
      }
      return acc;
    }, {});
  
    return (
      <BarChart
        width={600}
        height={300}
        data={Object.values(chartData)} // Convert object to array for the chart
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="survivors" fill="#82ca9d" /> {/* Display survivors data */}
      </BarChart>
    );
  };

export default Graph;