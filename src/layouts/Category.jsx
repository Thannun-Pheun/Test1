import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; // Outlet renders the children components (Book, User, Sale)

const Category = () => {
  const [category, setCategory] = useState([]);
  const api = "http://127.0.0.1:8000/Categories";

  useEffect(() => {
    async function getCategory() {
      try {
        const response = await axios.get(api); // Await the axios.get call
        const { data } = response;
        console.log(data);
        setCategory(data); // Set the response data to state
        console.log(data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    }
    getCategory();
  }, []);

  return (
    <div>
      {
        category.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
          </div>
        ))
      
    }
      
    </div>
  );
};

export default Category;
