import React from "react";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Component/Login.jsx";
import Register from "./Component/Register.jsx";
import AdminDashboard from "./dashboards/admin/AdminDashboard.jsx";
import AccountantDashboard from "./dashboards/accountant/AccountantDashboard.jsx";
import CustomerDashboard from "./dashboards/customer/CustomerDashboard.jsx";
function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/accountant/*" element={<AccountantDashboard />} />
        <Route path="/customer/*" element={<CustomerDashboard />} />
      </Routes>
    
  );
}

export default App;