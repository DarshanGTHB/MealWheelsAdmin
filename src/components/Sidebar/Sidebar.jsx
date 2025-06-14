import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/admin_assets/assets";
import './Sidebar.css'
import SignInPopup from "../SignInPopup/SignInPopup";
import FirebaseContext from "../../context/Firebase/FirebaseContext";

const Sidebar = () => {
  const { user, signOut } = useContext(FirebaseContext);

  // Helper to disable navigation
  const navProps = user === null
    ? { tabIndex: -1, 'aria-disabled': true, style: { pointerEvents: 'none', opacity: 0.5 } }
    : {};

  return (
    <div className="admin-sidebar">
      <div className="admin-info">
        <SignInPopup />
        <button onClick={signOut}>sign Out</button>
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
          {...navProps}
        >
          All Users
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          {...navProps}
        >
          All Products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          {...navProps}
        >
          App Orders
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;