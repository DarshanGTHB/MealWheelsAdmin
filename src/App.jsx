import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products/Products";
import Users from "./pages/Users/Users";
import Orders from "./pages/Orders/Orders";
import ItemForm from "./pages/ItemForm/ItemForm";
import EditForm from "./pages/EditForm/EditForm";


function App() {


  return (
    <div className="app-content">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/add-item" element={<ItemForm />} />
          <Route path="/update" element={<EditForm />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;