import React, { useState } from 'react';
import { BarChart2, FileText, Users, DollarSign, Briefcase } from 'lucide-react';
import axios from "../../Services/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
const ReportsPage = () => {
  const styles = `
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .reports-container {
      min-height: 100vh;
      padding: 24px;
      background-color: #f3f4f6;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .header-title {
      font-size: 24px;
      font-weight: 600;
      color: #374151;
      display: flex;
      align-items: center;
    }
    .header-title svg {
      margin-right: 8px;
      color: #6b7280;
    }
    .message {
      background-color: #dbeafe;
      color: #1e40af;
      padding: 8px 12px;
      border-radius: 6px;
      text-align: center;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card:hover {
      transform: scale(1.05);
    }
    .card h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }
    .card p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .card button {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      color: white;
    }
    .btn-green { background-color: #16a34a; }
    .btn-green:hover { background-color: #15803d; }
    .btn-indigo { background-color: #4f46e5; }
    .btn-indigo:hover { background-color: #4338ca; }
    .btn-yellow { background-color: #ca8a04; }
    .btn-yellow:hover { background-color: #a16207; }
    .btn-pink { background-color: #db2777; }
    .btn-pink:hover { background-color: #be185d; }
  `;

  const [message, setMessage] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(null);
  
  const handleGenerateReport = async (reportType) => {
    setMessage(`Generating ${reportType} report...`);
    
    setReportData(null);

    try {
      const token = localStorage.getItem("token");
      let res;

      if (reportType === "Customer") {
      res = await axios.get(`http://localhost:8080/reports/customer/9`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else if (reportType === "Invoices") {
      const month = "2025-08";
      res = await axios.get(
        `http://localhost:8080/reports/invoices/monthly?month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else if (reportType === "Products") {
      res = await axios.get("http://localhost:8080/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    }
let formatted = [];

if (reportType === "Customer") {
  const customer = res.data.customer;
  const invoiceCount = res.data.invoices?.length || 0;
  formatted = [{
    name: customer.name,
    invoiceCount
  }];
} else if (reportType === "Invoices") {
  const month = "2025-08";
  const invoiceRes = await axios.get(
    `http://localhost:8080/reports/invoices/monthly?month=${month}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  formatted = Object.entries(invoiceRes.data).map(([key, value]) => ({
    name: key,
    value: Number(value)
  }));
} else if (reportType === "Products") {
  formatted = res.data.map(prod => ({
    name: prod.name,
    price: prod.price
  }));
}

console.log("Formatted data for chart:", formatted);
setReportData(formatted);

setReportType(reportType);
setMessage(`'${reportType}' report generated successfully!`);
} catch (err) {
  console.error(err);
  setMessage(`Failed to generate ${reportType} report`);
}

setTimeout(() => setMessage(null), 3000);
};


  return (
    <>
      <style>{styles}</style>
      <div className="reports-container">
        <div className="header">
          <h2 className="header-title">
            <BarChart2 size={24} />
            Reports & Analytics
          </h2>
        </div>

        {message && <div className="message">{message}</div>}
        
        <div className="grid">
          <div className="card">
            <Users size={48} color="#4f46e5" style={{ marginBottom: "16px" }} />
            <h3>Customer Report</h3>
            <p>Detailed analysis of customer activity and trends.</p>
            <button className="btn-indigo" onClick={() => handleGenerateReport('Customer')}>
              Generate Report
            </button>
          </div>
          <div className="card">
            <FileText size={48} color="#ca8a04" style={{ marginBottom: "16px" }} />
            <h3>Invoices Report</h3>
            <p>View and export all invoice data and statuses.</p>
            <button className="btn-yellow" onClick={() => handleGenerateReport('Invoices')}>
              Generate Report
            </button>
          </div>
          <div className="card">
            <Briefcase size={48} color="#db2777" style={{ marginBottom: "16px" }} />
            <h3>Products Report</h3>
            <p>Analyze product performance and profitability.</p>
            <button className="btn-pink" onClick={() => handleGenerateReport('Products')}>
              Generate Report
            </button>
          </div>
        </div>
        {reportData && (
          <div style={{ width: "100%", height: 300, marginBottom: "20px", background: "#fff", padding: "12px", borderRadius: "8px" }}>
            <ResponsiveContainer width="100%" height="100%">
  <BarChart data={reportData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey={
        reportType === "Customer" ? "name" :
        reportType === "Invoices" ? "name" :
        reportType === "Products" ? "name" : "date"
      } 
    />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar 
      dataKey={
        reportType === "Customer" ? "invoiceCount" :
        reportType === "Invoices" ? "value" :
        reportType === "Products" ? "price" : "value"
      } 
      fill="#4f46e5" 
    />
  </BarChart>
</ResponsiveContainer>
{reportData && (!Array.isArray(reportData) || reportData.length === 0) && (
  <div style={{ background: "#fff", padding: "12px", borderRadius: "8px" }}>
    <p>No chartable data available. Showing raw JSON:</p>
    <pre>{JSON.stringify(reportData, null, 2)}</pre>
  </div>
)}
          </div>
        )}
      </div>
    </>
  );
};
export default ReportsPage;