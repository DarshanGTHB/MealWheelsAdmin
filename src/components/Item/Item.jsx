import React from "react";
import "./Item.css";

const Item = ({ item, fetchProducts }) => {
  const handleDelete = async () => {
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
      fetchProducts();
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Call the onDelete prop to update the parent component's state
      //   onDelete(item._id);
    } catch (error) {
      console.error("Error deleting item:", error);
      // You might want to show an error message to the user here
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
          <button className="delete-btn" onClick={handleDelete}>
            <i className="fas fa-trash-alt"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
