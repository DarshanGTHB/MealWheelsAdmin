import React, { useState } from "react";
import "./Item.css";
import { toast } from "react-toastify";

const Item = ({ item, fetchProducts }) => {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${item._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    // Add edit logic here
    console.log("Edit item:", item.id);
  };

  return (
    <div className="item">
      <div className="item-image">
        <img src={item.image} alt={item.name} />
        <div className="item-category">{item.category}</div>
      </div>
      <div className="item-content">
        <h3 className="item-name">{item.name}</h3>
        <div className="item-price">₹{item.price}</div>
        <div className="item-description">{item.description}</div>
        <div className="item-actions">
          <button className="edit-btn" onClick={handleEdit}>
            <i className="fas fa-edit"></i>
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <span className="spinner"></span>
            ) : (
              <i className="fas fa-trash-alt"></i>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
