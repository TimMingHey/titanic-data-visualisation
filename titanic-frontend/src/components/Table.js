import React from 'react';
import '../css/styles.css'; 

const Table = ({ data }) => (
    <table>
      <thead>
        <tr>
          <th>Passenger ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Sex</th>
          <th>Survived</th>
        </tr>
      </thead>
      <tbody>
        {data.map((passenger) => (
          <tr key={passenger.PassengerId}>
            <td>{passenger.PassengerId}</td>
            <td>{passenger.Name}</td>
            <td>{passenger.Age}</td>
            <td>{passenger.Sex}</td>
            <td>{passenger.Survived === '1' ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

export default Table;