import React, { useState } from "react";
import { Menu, UserCircle2, LogOut, FileText, DollarSign } from "lucide-react";
import MyInvoicesPage from "./MyInvoicesPage.jsx";
import MyPaymentsPage from "./MyPaymentsPage.jsx";
import CustomerProfile from "./CustomerProfile.jsx";
import { jwtDecode } from "jwt-decode";

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("profile");

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/login";
  };

  let customerName = "Profile";
  const storedToken = localStorage.getItem("token");
  
  if (storedToken) {
    try {
      const token = storedToken.replace("Bearer ", "");
      const decoded = jwtDecode(token);
    customerName = decoded.sub || decoded.username || "Profile";
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
  const links = [
    { name: "Invoices", id: "invoices", icon: FileText },
    { name: "Payments", id: "payments", icon: DollarSign },
  ];
  const renderPage = () => {
    switch (activePage) {
      case "invoices":
        return <MyInvoicesPage />;
      case "payments":
        return <MyPaymentsPage />;
      case "profile":
        return <CustomerProfile />;
      default:
        return <CustomerProfile />;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <nav className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          {sidebarOpen && <div>AccuBillify</div>}
        </div>
        <div className="sidebar-menu">
          {links.map((link, index) => (
            <div
              key={index}
              className={`sidebar-menu-item ${activePage === link.id ? "active" : ""}`}
              onClick={() => setActivePage(link.id)}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </div>
          ))}
          <div className="sidebar-email-display">
    <UserCircle2 size={18} />
    <span>{customerName}</span>
  </div>
        </div>
      </nav>
      <main className={`main-content ${sidebarOpen ? "" : "collapsed"}`}>
        <header className="navbar">
          <div className="navbar-left">Customer Dashboard</div>
          <div className="navbar-right">
            <div
              className={`navbar-profile-link ${activePage === "profile" ? "active" : ""}`}
              onClick={() => setActivePage("profile")}
            >
              <UserCircle2 size={18} />
              Profile
            </div>
            <button onClick={handleLogout} className="navbar-logout-link">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>
        <div className="page-content">
          {renderPage()}
        </div>
      </main>
      <style>{`
        /* Your CSS styles here */
        body, html, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%; 
        }
        .dashboard-wrapper {
          width: 100vw;
          display: flex;
          height: 100vh;
          font-family: Arial, sans-serif;
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
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          display: flex;
          // font-size: 1.5rem;
          align-items: center;
          // user-select: none;
          justify-content: ${sidebarOpen ? 'start' : 'center'};
        }
        .sidebar-header div {
          margin-left: ${sidebarOpen ? '10px' : '0'};
          font-weight: bold;
          font-size: 1.5rem;
          opacity: ${sidebarOpen ? '1' : '0'};
          user-select: none;
          transition: opacity 0.3s ease;
        }
        .sidebar-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: white;
        }
        .sidebar-menu {
          flex-grow: 1;
        }
        .sidebar-email-display {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f1f1f1;
          opacity: 0.9;
          font-size: 0.9rem;
          pointer-events: none; /* makes it unclickable */
        }
        .sidebar.collapsed .sidebar-email-display span {
          display: none;
        }

        .sidebar-menu-item {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f1f1f1;
          text-decoration: none;
          transition: background-color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-menu-item:hover,
        .sidebar-menu-item.active {
          background: rgba(0,0,0,0.2);
        }
        .sidebar.collapsed .sidebar-menu-item span {
          display: none;
        }

        .main-content {
          width:100%;
          background: #f4f6f8;
          overflow-y: auto;
          height: 100vh;
        }

        .navbar {
          background: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          box-sizing: border-box;
        }
        .navbar-left {
          font-weight: 700;
          font-size: 1.5rem;
          color: #222;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-shrink: 0;
        }
            
        .navbar-right a, .navbar-right div { /* Apply styles to both links and divs */
          color: #555;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background-color 0.2s;
          cursor: pointer;
        }
        .navbar-right a:hover, .navbar-right div:hover {
          background-color: #eee;
        }
        .navbar-right a.active, .navbar-right div.active {
          background-color: #eee;
          color: #000;
        }
        .navbar-logout-link {
            color: #0c0b0bff;
        }
        .navbar-logout-link:hover {
            background-color: #fee2e2;
            color: #0b0b0bff;
        }

        .page-content {
          box-sizing: border-box;
          padding: 20px;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            z-index: 1000;
            height: 100%;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .sidebar.collapsed {
            transform: translateX(-100%);
            width: 0;
          }
          .sidebar-header {
            justify-content: center;
          }
          .sidebar-header div {
            opacity: 0;
            width: 0;
            overflow: hidden;
          }
          .sidebar-toggle-btn {
            margin: 0;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .navbar-right {
            flex-wrap: wrap;
            justify-content: flex-end;
          }
          .navbar-right a, .navbar-right div {
            margin: 5px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;