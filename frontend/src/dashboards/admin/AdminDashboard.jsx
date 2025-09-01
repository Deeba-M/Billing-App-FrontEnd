import React, { useState,useEffect } from "react";
import { User, Box, FileText, CreditCard, BarChart2, LogOut, UserCircle2, Menu, Search } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { jwtDecode } from "jwt-decode";
import CustomersPage from "./CustomersPage.jsx";
import InvoicePage from "./InvoicePage.jsx";
import PaymentPage from "./PaymentPage.jsx";
import ProductsPage from "./ProductsPage.jsx";
import ReportsPage from "./ReportsPage.jsx";
import axios from "axios";
const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [kpis, setKpis] = useState({
    users: 0,
    Invoices: 0,
    revenue: 58000,
    products: 0,
  });

  useEffect(() => {
  fetchCustomerCount();
  fetchProductCount();
  fetchInvoiceCount();
}, []);
const [users, setUsers] = useState([]);

const fetchCustomerCount = async () => {
  try {
    const token = localStorage.getItem("token"); 
    const res = await axios.get("http://localhost:8080/customers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setKpis((prev) => ({ ...prev, users: res.data.length })); 
    setUsers(res.data); 

  } catch (err) {
    console.error("Error fetching customer count:", err);
  }
};
const fetchProductCount = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setKpis((prev) => ({ ...prev, products: res.data.length })); 
    setProducts(res.data); 
  } catch (err) {
    console.error("Error fetching product count:", err);
  }
};

const fetchInvoiceCount = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/invoices", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Invoices API response:", res.data);

    
    let invoicesArray = [];
if (Array.isArray(res.data)) {
  invoicesArray = res.data.map(inv => ({
    id: inv.id,
    dueDate: inv.dueDate,
    status: inv.status,
    totalAmount: inv.items?.reduce(
      (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
      0
    ) || 0,
    customerId: inv.customer?.id || 0,
    customerName: inv.customer?.name || `Customer ${inv.customerId}`,
  }));
}
setInvoices(invoicesArray);
setKpis(prev => ({ ...prev, invoices: invoicesArray.length }));
<InvoicePage onUpdate={fetchInvoiceCount} />
  } catch (err) {
    console.error("Error fetching invoice count:", err);
    setInvoices([]); 
    setKpis(prev => ({ ...prev, invoices: 0 }));
  }
};



let adminName = "Profile";
const storedToken = localStorage.getItem("token");

if (storedToken) {
  try {
    const token = storedToken.replace("Bearer ", ""); 
    const decoded = jwtDecode(token);

    
    adminName = decoded.sub || decoded.username || "Profile";
  } catch (err) {
    console.error("Invalid token:", err);
  }
}
  
  const renderDashboard = () => (
    <>
      <div className="kpi-cards">
        <div className="kpi-card">
          <User size={40} />
          <div className="kpi-content">
            <span>Total Users</span>
            <span className="number">{kpis.users.toLocaleString()}</span>
          </div>
        </div>
        <div className="kpi-card">
          <FileText size={40} />
          <div className="kpi-content">
            <span>Invoices</span>
            <span className="number">{kpis.invoices?.toLocaleString() || 0}</span>
          </div>
        </div>
        <div className="kpi-card">
          <BarChart2 size={40} />
          <div className="kpi-content">
            <span>Total Products</span>
            <span className="number">{kpis.products?.toLocaleString() || 0}</span>
          </div>
        </div>
        
      </div>

      <h2 style={{ marginLeft: 25 }}>Recent Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginLeft: 25 }}>Recent Invoices</h2>
<table>
  <thead>
    <tr>
      <th>Invoice #</th>
      <th>Customer</th>
      <th>Amount (₹)</th>
      <th>Date</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(invoices) && invoices.map((inv) => (
      <tr key={inv.id}>
        <td>{inv.id}</td>
        <td>{inv.customerName}</td>
        <td>{inv.totalAmount?.toLocaleString() || 0}</td>
        <td>{inv.dueDate}</td>
        <td>{inv.status}</td>
      </tr>
    ))}
  </tbody>
</table>

    </>
  );

  
  const renderPage = () => {
    switch (activePage) {
      case "customers":
        return <CustomersPage />;
      case "products":
        return <ProductsPage />;
      case "invoices":
        return <InvoicePage />;
      case "payments":
        return <PaymentPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <style>{`
        body, html, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100vw;
          font-family: Arial, sans-serif;
        }
        .dashboard-wrapper {
          width: 100vw;
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          background: linear-gradient(125deg, #e374f4, #aa1bed, #844582, #a6dff4);
          color: white; 
          width: 240px; 
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }
        .sidebar.collapsed { 
        width: 60px; 
        }
        .sidebar-header { 
        padding: 20px; 
        font-size: 1.5rem;
        
        text-align: center; 
        border-bottom: 1px solid #3e4e5e; 
        user-select:none; 
        }
        .sidebar-menu { 
        flex-grow: 1; 
        padding: 10px 0; 
        }
        .sidebar-menu-item {
          padding: 12px 20px; 
          display: flex; 
          align-items: center; 
          gap: 12px; cursor: pointer; 
          color: #cfd8dc;
          font-weight: 500; 
          transition: background-color 0.2s; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
          user-select:none;
        }
        .sidebar-menu-item:hover, .sidebar-menu-item.active {
          background: #1c2733; color: #fff;
        }
        .sidebar-menu-item svg { min-width: 20px; min-height: 20px; }
        .sidebar.collapsed .sidebar-menu-item span { display: none; }
        .main-content {
          flex-grow: 1;
        
          transition: margin-left 0.3s;
          background: #f4f6f8;
          overflow-y: auto;
          height: 100vh;
        }
        .main-content.collapsed { margin-left: 12px; }
        .navbar {
          background: white; 
          padding: 15px 25px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
          position: sticky; 
          top: 0; z-index: 100;
          // user-select:none;
        }
        .navbar-left {
          font-weight: 700; 
          font-size: 1.5rem; 
          color: #222;
          display: flex; 
          align-items: center; 
          gap: 10px;
        }
        .sidebar-toggle-btn {
        
          background: fixed; 
          border: none; 
          cursor: pointer; 
          padding: 5px; 
          color: #f8f2f2ff;
          margin-right:12px;
        }
        .navbar-right {
          display: flex; 
          align-items: center; 
          gap: 15px; 
          font-weight: 600; 
          color: #555;
        }
        .navbar-right button {
          background: none; 
          border: none; 
          cursor: pointer; 
          color: #555; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          font-size: 1rem;
          padding: 6px 12px; 
          border-radius: 6px; 
          transition: background-color 0.2s;
          user-select:none;
        }
        .navbar-right button:hover { 
        background-color: #eee; 
        }
        .search-bar {
          display: flex;
          justify-content: center;
          margin: 20px 25px 30px;
          // user-select:none;
        }
        .search-bar input {
          width: 300px;
          padding: 10px 15px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 25px;
          outline: none;
          transition: border-color 0.3s;
        }
        .search-bar input:focus {
          border-color: #4caf50;
        }
        .search-bar svg {
          position: relative;
          left: -30px;
          top: 10px;
          color: #888;
          pointer-events: none;
        }
        .kpi-cards {
          // width: 100vw;
          display: flex;
          gap: 20px;
          justify-content: space-between;
          margin: 0 25px 40px;
          flex-wrap: wrap;
        }
        .kpi-card {
          // width: 100vw;
          flex: 1 1 22%;
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          color: #444;
          min-width: 200px;
        }
        .kpi-card svg {
          color: #4caf50;
          min-width: 40px;
          min-height: 40px;
        }
        .kpi-content {
          display: flex;
          flex-direction: column;
        }
        .kpi-content .number {
          font-size: 1.6rem;
          font-weight: bold;
          margin-top: 5px;
        }
        table {
          width: calc(100% - 50px);
          margin: 0 25px 40px;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
          
        th, td {
          padding: 12px 15px;
          border-bottom: 1px solid #ddd;
          text-align: left;
          color: #555;
        }
        th {
          background: linear-gradient(125deg, #e374f4,#aa1bed);
          font-weight: 600;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .status {
          padding: 5px 10px;
          border-radius: 20px;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          width: fit-content;
          user-select:none;
        }
        .status.Active, .status.Shipped, .status.Delivered {
          background-color: #4caf50;
        }
        .status.Pending, .status.Processing {
          background-color: #ff9800;
        }
        .status.Banned, .status.Cancelled {
          background-color: #f44336;
        }
        
        @media (max-width: 900px) {
          .kpi-cards {
            flex-direction: column;
            gap: 15px;
          }
          .kpi-card {
            flex: 1 1 100%;
          }
            .profile UserCircle2 {
            top:12px
            bottom:12px
            }
          .sidebar {
            position: fixed;
            z-index: 1000;
            height: 100%;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-content {
            margin-left: 0 !important;
          }

        }

      `}</style>

      <div className="dashboard-wrapper">
        <nav className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          {!sidebarOpen && (
      <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden"
      onClick={() => setSidebarOpen(true)}
      ></div>
)}

          <div className="sidebar-header" >
            <button
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle Sidebar"
              >
                <Menu size={24} />
              </button>
              {sidebarOpen && <span>AccuBillify</span>}
          </div>
          
          <div className="sidebar-menu">
            <div
              className={`sidebar-menu-item ${activePage === "customers" ? "active" : ""}`}
              onClick={() => setActivePage("customers")}
            >
              <User size={20} />
              <span>Customers</span>
            </div>
            <div
              className={`sidebar-menu-item ${activePage === "products" ? "active" : ""}`}
              onClick={() => setActivePage("products")}
            >
              <Box size={20} />
              <span>Products / Services</span>
            </div>
            <div
              className={`sidebar-menu-item ${activePage === "invoices" ? "active" : ""}`}
              onClick={() => setActivePage("invoices")}
            >
              <FileText size={20} />
              <span>Invoices</span>
            </div>
            <div
              className={`sidebar-menu-item ${activePage === "payments" ? "active" : ""}`}
              onClick={() => setActivePage("payments")}
            >
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
            <div
              className={`sidebar-menu-item ${activePage === "reports" ? "active" : ""}`}
              onClick={() => setActivePage("reports")}
            >
              <BarChart2 size={20} />
              <span>Reports</span>
            </div>
            <div
            className={`sidebar-menu-item`}>
            <UserCircle2 size={18} />
  <span>{adminName}</span>
</div>


          </div>
        </nav>

        <main className={`main-content ${sidebarOpen ? "" : "collapsed"}`}>
          <header className="navbar">
            <div className="navbar-left">
              
              Admin Dashboard
            </div>
            <div className="navbar-right">
              <button onClick={() => setActivePage("dashboard")}>
                <BarChart2 size={18} />
                Home
              </button>

              <button
                onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }}
              >
              <LogOut size={18} />
                Logout
              </button>
            </div>
          </header>
          {renderPage()}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
