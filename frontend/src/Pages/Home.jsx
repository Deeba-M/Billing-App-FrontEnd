import React from "react";
// import Navbar from "../Component/Navbar.jsx";
import "./Home.css";
import { FaUserShield, FaFileInvoiceDollar, FaCreditCard } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="root">
    <div className="main">
      {/* <Navbar /> */}
      <div className="home-container">
        <div className="hero-section">
          <img src="/logo.jpg" alt="App Logo" className="promo-logo" />
          <h1>Welcome to AccuBilliify</h1>
          <p>Your all-in-one platform to manage invoices, payments, and customers with ease.</p>
          <button className="get-started-btn"><Link to="/login">Get Started</Link></button>
        </div>

        <div className="steps-section">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <FaUserShield className="step-icon" />
              <h3>1. Create an Account</h3>
              <p>Sign up as an Admin or Customer to access personalized dashboards.</p>
            </div>
            <div className="step-card">
              <FaFileInvoiceDollar className="step-icon" />
              <h3>2. Manage Invoices</h3>
              <p>Create, send, and track invoices in just a few clicks.</p>
            </div>
            <div className="step-card">
              <FaCreditCard className="step-icon" />
              <h3>3. Process Payments</h3>
              <p>Record payments securely and keep track of all transactions.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Start Managing Your Business Smarter</h2>
          <p>Join thousands of users who trust AccuBilliify for efficient billing and payment management.</p>
          <button className="get-started-btn"><Link to="/Register">Create Your Account</Link></button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Home;
