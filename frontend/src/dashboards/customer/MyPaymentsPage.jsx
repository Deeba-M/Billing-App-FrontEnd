import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "../../Services/axios";
const MyPaymentPage = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [history, setHistory] = useState([]);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedGateway, setSelectedGateway] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    bank: "",
    holder: "",
    expiry: "",
    pin: "",
  });
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
  };

  const handleGatewaySelect = async (option) => {
    setSelectedGateway(option);
    setMessage("");

    if (option === "QR Code") {
      setShowQRCode(true);
      setShowCardForm(false);
    } else if (option === "Card") {
      setShowCardForm(true);
      setShowQRCode(false);
    } else {
      const token = localStorage.getItem("token");
      const amount = totalAmount;
      const currency = "INR";

      try {
        const response = await axios.post(
          `http://localhost:8080/api/payments/external/${option.toLowerCase()}?amount=${amount}&currency=${currency}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const redirectUrl = response.data.redirectUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          setMessage("⚠ Payment gateway did not return a redirect URL.");
        }
      } catch (error) {
        console.error("❌ Failed to initiate external payment:", error);
        setMessage("❌ Failed to initiate gateway payment.");
      }
    }
  };

  const generateInvoicePDF = (invoiceId) => {
    const doc = new jsPDF();
    doc.text("Invoice", 105, 20, null, null, "center");
    autoTable(doc, {
      head: [["Product", "Qty", "Price", "Total"]],
      body: products.map((p) => [p.name, p.qty, p.price, p.total]),
    });
    doc.text(`Invoice ID: #${invoiceId}, 14, doc.autoTable.previous.finalY + 10`);
    doc.text(`Total Amount: ₹${totalAmount}, 14, doc.autoTable.previous.finalY + 20`);
    doc.save(`Invoice-${invoiceId}.pdf`);
  };

  const savePaymentToBackend = async (amount) => {
    try {
      const token = localStorage.getItem("token");
      const paymentDate = new Date().toISOString().split("T")[0];
      const res = await axios.post(
        "http://localhost:8080/api/payments",
        { amount, paymentDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const invoiceId = res.data.invoiceId || Math.floor(Math.random() * 9000 + 1000);
      setHistory([...history, { id: history.length + 1, amount, date: paymentDate, method: selectedGateway }]);
      generateInvoicePDF(invoiceId);
    } catch (err) {
      setMessage("❌ Failed to save payment.");
    }
  };
  const handleQRCodePaymentConfirmed = async () => {
  try {
    const token = localStorage.getItem("token");
    const today = new Date().toISOString().split("T")[0];

    const mockPayload = {
      invoiceId: 1,
      amount: totalAmount,
      paymentDate: today,
      amountInPaise: false
    };

    await axios.post("http://localhost:8080/api/payments/qr/mock-webhook", mockPayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setShowGatewayModal(false);
    setShowQRCode(false);
    setProducts([]);
    setStep(1);
    setMessage("✅ QR Code payment confirmed via mock webhook.");
  } catch (err) {
    setMessage("❌ QR Payment simulation failed.");
  }
};
   const handleCardPayment = async () => {
    if (!cardDetails.number || !cardDetails.bank || !cardDetails.holder || !cardDetails.expiry || !cardDetails.pin) {
      setMessage("⚠ Please fill all card details.");
      return;
    }
    await savePaymentToBackend(totalAmount);
    setShowGatewayModal(false);
    setShowCardForm(false);
    setProducts([]);
    setCardDetails({ number: "", bank: "", holder: "", expiry: "", pin: "" });
    setStep(1);
    setMessage("✅ Payment successful via Card.");
  };


  return (
    <>
      <style>{`
        body, html, #root {
          width:100vw;
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: Arial, sans-serif;
          color: black;
          background-color: #f8f9fa; /* Light background for the entire page */
        }

        /* Top Left Heading for the Page */
        .page-title {
          font-weight: 700;
          font-size: 2rem; /* Larger font size for prominence */
          color: #222;
          padding: 20px; /* Padding around the title */
          margin-bottom: 20px;
          text-align: left; /* Align to top-left */
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
        }
        
        .payment-page {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
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
        .history-section h3,
        .product-form h3 {
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
          width: 10%;
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
          box-sizing: border-box;
        }
        .product-form button,
        .product-list button {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
          transition: background-color 0.3s ease;
        }
        .product-form button:hover,
        .product-list button:hover {
          background: linear-gradient(125deg, #aa1bed, #e374f4);
        }
        .message {
          padding: 10px;
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          color: white;
          border-radius: 6px;
          margin-top: 15px;
          font-weight: bold;
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
          position: relative;
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
          transition: background-color 0.3s ease;
        }
        .gateway-buttons button:hover,
        .qr-code-container button:hover {
          background: linear-gradient(125deg, #aa1bed, #e374f4);
        }
        .close-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }
        .close-btn:hover {
          background: #dc2626;
        }
        /* Card Form Specific Styles */
        .modal input {
          margin: 10px auto;
          display: block;
          width: calc(100% - 20px);
        }
      `}</style>

      <h1 className="page-title">My Payments</h1> 
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

      {showGatewayModal && (
        <div className="modal-overlay">
          <div className="modal">
            {!showQRCode && !showCardForm ? (
              <>
                <h3>Select Payment Gateway</h3>
                <div className="gateway-buttons">
              {["QR Code", "Card", "Paypal", "Razorpay", "Stripe", "Paytm", "Instamojo"].map((gateway) => (
                <button key={gateway} onClick={() => handleGatewaySelect(gateway)}>{gateway}</button>
              ))}
            </div>
              </>
            ) : showQRCode ? (
              <>
                <h3>Scan QR Code to Pay</h3>
                <div className="qr-code-container">
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
            ) : (
              <>
                <div className="qr-code-container">
                <h3>Enter Card Details</h3>
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
                </div>
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
    </>
  );
};

export default MyPaymentPage;