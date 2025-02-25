import React, { useEffect, useState } from "react";
import axios from "axios";

const BicycleList = () => {
  const [bicycles, setBicycles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5050/api/bicycles")
      .then((response) => setBicycles(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Bicycles</h1>
      <ul>
        {bicycles.map((bike) => (
          <li key={bike._id}>
            {bike.name} - ${bike.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BicycleList;