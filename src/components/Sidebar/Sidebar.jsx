import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/admin_assets/assets";
import './Sidebar.css'
import SignInPopup from "../SignInPopup/SignInPopup";
import FirebaseContext from "../../context/Firebase/FirebaseContext";

const Sidebar = () => {
  const { user, signOut } = useContext(FirebaseContext);
  const [imageError, setImageError] = useState(false);

  // Helper to disable navigation when user is not logged in
  const navProps = user === null
    ? { tabIndex: -1, 'aria-disabled': true, style: { pointerEvents: 'none', opacity: 0.5 } }
    : {};

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setImageError(false); // Reset image error state on sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Extract user's first name or fallback to full name
  const getUserDisplayName = () => {
    if (!user?.displayName) return 'Admin User';
    const firstName = user.displayName.split(' ')[0];
    return firstName || user.displayName;
  };

  return (
    <div className="admin-sidebar">
      <div className={`admin-info ${!user ? 'logged-out' : ''}`}>
        {user ? (
          // Logged in user section
          <>
            {user.photoURL && !imageError ? (
              <img 
                src={user.photoURL} 
                alt="Admin Avatar" 
                className="admin-avatar"
                onError={handleImageError}
              />
            ) : (
              <img 
                src={assets.profile_image} 
                alt="Default Avatar" 
                className="admin-avatar" 
              />
            )}
            <h3 className="admin-name">{getUserDisplayName()}</h3>
            <div className="admin-role">ADMIN</div>
            <div className="auth-section">
              <button 
                onClick={handleSignOut}
                className="auth-btn"
                title="Sign out of your account"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          // Not logged in section
          <div className="sign-in-prompt">
            <div className="loading-avatar">👤</div>
            <h3>Admin Access Required</h3>
            <p>Please sign in to access the admin dashboard</p>
            <SignInPopup />
          </div>
        )}
      </div>
      
      {user && <hr />}
      
      <nav className="nav-links">
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          {...navProps}
          title={user ? "Manage all users" : "Sign in to access users"}
        >
          <span className="nav-icon">👥</span>
          All Users
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          {...navProps}
          title={user ? "Manage all products" : "Sign in to access products"}
        >
          <span className="nav-icon">📦</span>
          All Products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          {...navProps}
          title={user ? "View app orders" : "Sign in to access orders"}
        >
          <span className="nav-icon">📋</span>
          App Orders
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;