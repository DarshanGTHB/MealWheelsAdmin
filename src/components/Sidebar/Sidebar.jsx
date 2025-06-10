import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/admin_assets/assets";
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-info">
        <img src={assets.profile_image} alt="" className="admin-avatar" />
        <h3 className="admin-name">Darshan Vekariya</h3>
        <div className="admin-role">ADMIN</div>
      </div>
      <hr />
      <nav className="nav-links">
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          All Users
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          All Products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          App Orders
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
