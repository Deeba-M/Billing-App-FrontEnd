import React, { useState, useEffect } from "react";
import { FaSyncAlt, FaEye } from "react-icons/fa";
import api from "../../Services/axios";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoices/me");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchInvoiceById = async (id) => {
    try {
      const res = await api.get(`/invoices/me/${id}`);
      setSelectedInvoice(res.data);
      setItems([]); 
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };

  const fetchInvoiceItems = async (id) => {
    try {
      const res = await api.get(`/invoices/me/${id}/items`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching invoice items:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);
const downloadInvoice = async (id) => {
  try {
    const res = await api.get(`/invoices/me/{id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_{id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Error downloading invoice:", err);
  }
};

  return (
    <div className="invoice-container">
      <h1 className="invoice-title">My Invoices</h1>
      <div className="search-box">
        <button onClick={fetchInvoices} className="btn secondary">
          <FaSyncAlt /> Refresh
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.dueDate}</td>
                <td>₹{inv.totalAmount}</td>
                <td>
                  <span
                    className={
                      inv.status === "PAID" ? "status-paid" : "status-unpaid"
                    }
                  >
                    {inv.status}
                  </span>
                </td>
                <td>
                  
                  <button className="btn success" onClick={() => downloadInvoice(inv.id)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedInvoice && (
        <div className="invoice-details">
          <h2>Invoice #{selectedInvoice.id}</h2>
          <p>Due Date: {selectedInvoice.dueDate}</p>
          <p>Total: ₹{selectedInvoice.totalAmount}</p>
          <p>Status: {selectedInvoice.status}</p>
        </div>
      )}
      {items.length > 0 && (
        <div className="invoice-items">
          <h3>Invoice Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.product?.name}</td>
                  <td>{it.quantity}</td>
                  <td>₹{it.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline CSS */}
      <style>{`
        .invoice-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .invoice-title {
          font-size: 24px;
          margin-bottom: 15px;
        }

        .search-box {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
        }

        .btn.secondary {
          background-color: #6c757d;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-table th,
        .invoice-table td {
        background: linear-gradient(125deg, #e374f4, #aa1bed);
          border: 1px solid #ddd;
          padding: 10px;
        }

        .invoice-table th {
          background: linear-gradient(125deg, #e374f4,#aa1bed);
          text-align: left;
        }

        .invoice-details,
        .invoice-items {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fafafa;
        }

        .status-paid {
          color: #646161ff;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .status-unpaid {
          color: #646161ff;
          padding: 4px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default InvoicePage;
