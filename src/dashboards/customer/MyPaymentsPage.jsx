import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";  
import {  FileText, CreditCard,  LogOut, UserCircle2,  } from "lucide-react";
import { Link } from "react-router-dom";
const MyPaymentPage = () => {
  const [activePage, setActivePage] = useState("dashboard");
 const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [history, setHistory] = useState([]);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
   const [showCardForm, setShowCardForm] = useState(false); // ✅ NEW state for card form
  const [cardDetails, setCardDetails] = useState({
    number: "",
    bank: "",
    holder: "",
    expiry: "",
    pin: "",
  });

  const [step, setStep] = useState(1); 

  const addProduct = () => {
    if (!productName || !quantity || !price) {
      setMessage("⚠ Please fill all product details.");
      return;
    }

    const newProduct = {
      id: products.length + 1,
      name: productName,
      qty: parseInt(quantity),
      price: parseFloat(price),
      total: parseInt(quantity) * parseFloat(price),
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setQuantity("");
    setPrice("");
    setMessage("");
    setStep(2);
  };

  const totalAmount = products.reduce((sum, p) => sum + p.total, 0);

  const handlePay = () => {
    if (products.length === 0) {
      setMessage("⚠ Please add products before payment.");
      return;
    }
    setShowGatewayModal(true);
    setShowQRCode(false);
    setShowCardForm(false);
  };

  const handleGatewaySelect = (option) => {
    if (option === "QR Code") {
      setShowQRCode(true);
      setShowCardForm(false);
    } else if (option === "Card") {
      // const newPayment = {
      //   id: history.length + 1,
      //   amount: totalAmount,
      //   date: new Date().toLocaleDateString(),
      //   method: option,
      // };
      // setHistory([...history, newPayment]);
      // setMessage(✅ Payment of ${totalAmount} INR successful via ${option});
      // setShowGatewayModal(false);
      // setProducts([]); // clear cart after payment
      setShowCardForm(true);
      setShowQRCode(false);
    }
  };

  const handleCardPayment = () => {
    // ✅ VALIDATION RULES ADDED
    if (
      !cardDetails.number ||
      !cardDetails.bank ||
      !cardDetails.holder ||
      !cardDetails.expiry ||
      !cardDetails.pin
    ) {
      setMessage("⚠ Please fill all card details.");
      return;
    }

    // ✅ Card number must be exactly 16 digits
    if (!/^\d{16}$/.test(cardDetails.number)) {
      setMessage("⚠ Card number must be 16 digits.");
      return;
    }

    // ✅ PIN must be 4 digits
    if (!/^\d{4}$/.test(cardDetails.pin)) {
      setMessage("⚠ PIN must be 4 digits.");
      return;
    }

    // ✅ Expiry date must be in the future
    const today = new Date();
    const expiryDate = new Date(cardDetails.expiry + "-01");
    if (expiryDate <= today) {
      setMessage("⚠ Card expiry date must be in the future.");
      return;
    }

    // ✅ If all good → process payment
    const newPayment = {
      id: history.length + 1,
      amount: totalAmount,
      date: new Date().toLocaleDateString(),
      method: "Card",
    };
    setHistory([...history, newPayment]);
    setMessage(`✅ Payment of ${totalAmount} INR successful via Card`);
    setShowGatewayModal(false);
    setShowCardForm(false);
    setProducts([]); // clear cart
    setCardDetails({ number: "", bank: "", holder: "", expiry: "", pin: "" });
    setStep(1);
  };


  const handleQRCodePaymentConfirmed = () => {
    const newPayment = {
      id: history.length + 1,
      amount: totalAmount,
      date: new Date().toLocaleDateString(),
      method: "QR Code",
    };
    setHistory([...history, newPayment]);
    setMessage(`✅ Payment of ${totalAmount} INR successful via QR Code`);
    setShowGatewayModal(false);
    setShowQRCode(false);
    setProducts([]); // clear cart after payment
    setStep(1); 
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside
          className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""} 
          }`}
        >
          <div className="sidebar-header">
            {!isSidebarCollapsed ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="sidebar-toggle-btn"
                >
                  ☰
                </button>
                <h1 className="sidebar-title">AccuBillify</h1>
              </div>
            ) : (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="sidebar-toggle-btn"
              >
                ☰
              </button>
            )}
          </div>
          <ul className="sidebar-menu">
  <Link to="/customer/invoices" className={`sidebar-menu-item ${activePage === "invoices" ? "active" : ""}`}>
    <FileText size={20} />
    {!isSidebarCollapsed && <span>Invoices</span>}
  </Link>

  <Link to="/customer/payments" className={`sidebar-menu-item ${activePage === "payments" ? "active" : ""}`}>
    <CreditCard size={20} />
    {!isSidebarCollapsed && <span>Payments</span>}
  </Link>
</ul>

        </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
                      <div className="navbar-left">
                      
                      My Invoices
                    </div>
                    <div className="navbar-right">
                      <button>
                        <UserCircle2 size={18} />
                        Profile
                      </button>
                      <button>
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </nav>

        {/* Payment Section */}
        <div className="payment-page">
          {step === 1 && ( 
          <div className="product-form">
            <h3>Enter Product Details</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={addProduct}>Add Product</button>
          </div>
          )}

          {step === 2 && (
            <div className="product-list">
              <h3>Products Added</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.qty}</td>
                      <td>{p.price}</td>
                      <td>{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Total Amount: {totalAmount} INR</h4>
              <button onClick={handlePay}>Proceed to Pay</button>
              <button onClick={() => setStep(1)}>← Back</button>
            </div>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>

      {/* Gateway Modal */}
      {showGatewayModal && (
        <div className="modal-overlay">
          <div className="modal">
            {!showQRCode ? (
              <>
                <h3>Select Payment Gateway</h3>
                <div className="gateway-buttons">
                  <button onClick={() => handleGatewaySelect("QR Code")}>
                    QR Code
                  </button>
                  <button onClick={() => handleGatewaySelect("Card")}>
                    Card
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Scan QR Code to Pay</h3>
                <div className="qr-code-container">
                  {/* ✅ Real QR Code generated */}
                  <QRCodeCanvas
                    value={`upi://pay?pa=merchant@upi&pn=AccuBillify&am=${totalAmount}&cu=INR`}
                    size={200}
                  />
                  <p>Scan this code with your UPI app.</p>
                  <button onClick={handleQRCodePaymentConfirmed}>
                    Payment Confirmed
                  </button>
                </div>
              </>
            )}
                {/* Step 2b: Card Form */}
            {showCardForm && (
              <>
                <h3>Enter Card Details</h3>
                {/* ✅ New fields for card details */}
                <input
                  type="text"
                  placeholder="Card Number (16 digits)"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={cardDetails.bank}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, bank: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  value={cardDetails.holder}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, holder: e.target.value })
                  }
                />
                <input
                  type="month"
                  placeholder="Expiry Date"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="PIN (4 digits)"
                  value={cardDetails.pin}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, pin: e.target.value })
                  }
                />
                <button onClick={handleCardPayment}>Confirm Payment</button>
              </>
            )}
            <button
              className="close-btn"
              onClick={() => {
                setShowGatewayModal(false);
                setShowQRCode(false);
                setShowCardForm(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        body, html, #root {
          margin: 0; 
          padding: 0; 
          height: 100%; 
          width: 100vw;
          font-family: Arial, sans-serif;
        }

        .dashboard-wrapper {
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
          // position: relative;
        }

        .sidebar.collapsed {
          width: 60px;
          // display: none;
        }

        .sidebar-header {
          padding: 20px;
          font-size: 1.5rem;
          text-align: center;
          border-bottom: 1px solid #3e4e5e; 
          user-select:none;
        }

        .sidebar-toggle-btn {
          background: fixed;
          border: none;
          cursor: pointer;
          color: #f8f2f2ff;
          font-size: 1.5rem;
          margin-right:12px;
          padding: 5px;
        }

        .sidebar-title {
          font-size: 1.8rem;
          font-weight: bold;
          color: white;
          margin-left: 10px;
        }

        .sidebar-menu {
          flex-grow: 1;
          padding:10px 0;
          // margin: 0;
          // list-style-type: none;
        }

        .sidebar-menu-item {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: white;
          font-weight:500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: background-color 0.2s;
          // background: none;
          // border: none;
          width: 100%;
          // text-align: left;
          user-select:none;
        }

        .sidebar.collapsed .sidebar-menu-item {
          justify-content: center;
          padding: 12px 0;
        } 

        .sidebar-menu-item svg {
            min-width: 20px;
            min-height: 20px;
        }
              
        /* Main Content */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
        }
        .navbar {
          background: white; 
          padding: 15px 25px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
          position: sticky; 
          top: 0; 
          z-index: 100;
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
              
        /* Payment Section */
        .payment-page {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
        }
        .product-form,
        .product-list,
        .history-section {
          margin-bottom: 20px auto;
          max-width: 900px; 
          padding: 20px;
          background: white;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .product-list h3,
        .history-section h3 {
          margin-bottom: 15px;
          font-size: 1.3rem;
          font-weight: 600;
          color: #111;
          text-align: left;
        }
        .product-list h4 {
          margin-top: 15px;
          font-size: 1rem;
          font-weight: bold;
        }
              
        .product-list table,
        .history-section table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
              
        .product-list th,
        .history-section th {
        width: 100%;
        margin: 20px;
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          color: white;
          padding: 10px;
        }
              
        .product-list td,
        .history-section td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
        }
              
        input,
        button {
          margin: 8px 0;
          padding: 10px;
          width: 95%;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .product-form button,
        .product-list button {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
         border: 1px solid #60a5fa;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
          width: 100%; 
        }
        .product-form button:hover,
        .product-list button:hover {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
        }
        .message {
          padding: 10px;
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          border: 1px solid #60a5fa;
          color: #1e3a8a;
          border-radius: 6px;
        }
              
        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        table,
        th,
        td {
          border: 1px solid #ddd;
        }
        th,
        td {
          padding: 8px;
          text-align: center;
        }
        th {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          color: white;
        }
              
        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .qr-code-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .qr-code-container canvas {
          margin: 20px 0;
        }
        .gateway-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin: 15px 0;
        }
        .gateway-buttons button,
        .qr-code-container button {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          color: white;
          font-weight: bold;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .gateway-buttons button:hover,
        .qr-code-container button:hover {
         background: linear-gradient(125deg, #e374f4, #aa1bed);
        }
        .close-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
        }

        .sidebar-menu-item.active {
  background-color: #1f2937; 
  color: #ffffff; 
}
`}</style>
    </div>
  );
};

export default MyPaymentPage;