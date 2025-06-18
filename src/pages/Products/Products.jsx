import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import { food_list } from "../../assets/frontend_assets/assets";
import Item from "../../components/Item/Item";
import { useContext } from "react";
import FirebaseContext from "../../context/Firebase/FirebaseContext";
import LoginWarn from "../LoginWarn/LoginWarn";

const Products = () => {

  const {user, loading} = useContext(FirebaseContext);

  const [products, setProducts] = useState([]);
  const [loading_, setLoading_] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // console.log(products);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items/");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.items);
      setLoading_(false);
    } catch (err) {
      setError(err.message);
      setLoading_(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/add-item');
  };

  if (loading_) {
    return <div className="loading_">Loading_ products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if(!user && !loading) return <LoginWarn/>


  return (
    <div className="products-wrapper">
      <div className="products-header">
        <h2 className="products-title">Our Products</h2>
        <button className="add-product-btn" onClick={handleAddProduct}>
          <span className="btn-icon">+</span>
          Add New Product
        </button>
      </div>
      <div className="product-container">
        {products.map((item, id) => {
          return <Item key={item._id || id} item={item} fetchProducts={fetchProducts}/>;
        })}
      </div>
    </div>
  );
};

export default Products;