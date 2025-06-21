import React, { useContext, useState, useEffect } from "react";
import "./Users.css";
import FirebaseContext from "../../context/Firebase/FirebaseContext";
import LoginWarn from "../LoginWarn/LoginWarn";

const Users = () => {
  const { user } = useContext(FirebaseContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading_, setLoading_] = useState(true);
  const [error, setError] = useState(null);

  // console.log(loading_);
  // Mock data - replace with actual API call

  useEffect(() => {
    // Replace this with your actual API call
    const fetchUsers = async () => {
      try {
        // Simulate API call
        const res = await fetch('http://localhost:5000/api/users',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )
        const data = await res.json();
        // console.log(data)
        setUsers(data.users);
        setFilteredUsers(data.users);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        // console.log('changeing loding _');
        setLoading_(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    const filtered = users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getRoleBadgeClass = (role) => {
    // return role.toLowerCase() === "admin"
    return 1=== "admin"
      ? "role-badge role-admin"
      : "role-badge role-user";
  };
  function getStatusBadgeClass(status) {
    switch (status) {
      case "active":
        return "badge badge-success";
      case "pending":
        return "badge badge-warning";
      case "banned":
        return "badge badge-danger";
      default:
        return "badge badge-secondary";
    }
  }
  if (!user && !loading) return <LoginWarn />;

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">User Management</h1>
        <p className="users-subtitle">Manage and monitor all system users</p>
      </div>

      <div className="users-controls">
        <div className="search-container">
          <div className="search-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="users-stats">
          <div className="stat-item">
            <span className="stat-number">{users?.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {users?.filter((u) => u.role === "admin").length}
            </span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
      </div>

      <div className="users-content">
        {loading_ ? (
          <div className="loading_-container">
            <div className="loading_-spinner"></div>
            <p>Loading_ users...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers?.length === 0 ? (
              <div className="no-users">
                <p>No users found matching your search.</p>
              </div>
            ) : (
              filteredUsers?.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <div className="user-meta">
                      <span className={getRoleBadgeClass(user.role)}>
                        {/* {user.role} */}
                        Admin
                        
                      </span>
                      <span className={getStatusBadgeClass(user.status)}>
                        {user.status}
                      </span>
                    </div>
                    <p className="user-join-date">
                      Joined: {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="user-actions">
                    <button className="action-btn edit-btn" title="Edit User">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="m18 2 4 4-14 14H4v-4L18 2z"></path>
                      </svg>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete User"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
