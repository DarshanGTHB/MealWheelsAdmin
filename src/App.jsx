import { useContext, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products/Products";
import Users from "./pages/Users/Users";
import Orders from "./pages/Orders/Orders";
import ItemForm from "./pages/ItemForm/ItemForm";
import EditForm from "./pages/EditForm/EditForm";
import FirebaseProvider from "./context/Firebase/FirebaseProvider";
import FirebaseContext from "./context/Firebase/FirebaseContext";
import SignInPopup from "./components/SignInPopup/SignInPopup";


function App() {

  return (
    <FirebaseProvider>
      <div className="app-content">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-item" element={<ItemForm />} />
          <Route path="/update" element={<EditForm />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
    </FirebaseProvider>
  );
}

export default App;