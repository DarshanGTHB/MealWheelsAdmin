import React, { useContext } from "react";
import "./Users.css";
import FirebaseContext from "../../context/Firebase/FirebaseContext";
import LoginWarn from "../LoginWarn/LoginWarn";

const Users = () => {
  const { user } = useContext(FirebaseContext);
  if (!user) return <LoginWarn />;
  return <div>User</div>;
};

export default Users;
