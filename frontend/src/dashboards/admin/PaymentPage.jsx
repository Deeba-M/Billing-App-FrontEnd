import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  CreditCard,
  Clock,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatStatus = (status) =>
    status
      ? status.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
      : "unpaid";
  const filteredPayments = payments.filter((p) => {
    const matchesStatus =
      statusFilter === "All" || formatStatus(p.status) === formatStatus(statusFilter);
    const matchesSearch =
      searchTerm === "" ||
      p.invoice?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoice?.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });
  const chartData = payments.reduce((acc, p) => {
    if (!p.paymentDate) return acc;
    const month = new Date(p.paymentDate).toLocaleString("default", { month: "short" });
    const existing = acc.find((c) => c.name === month);
    if (existing) existing.value += Number(p.amount);
    else acc.push({ name: month, value: Number(p.amount) });
    return acc;
  }, []);
  const pieData = Object.entries(
    payments.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];
  return (
    <div className="payments-container">
      <h1>Payments</h1>
      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by client or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
          <option>Refunded</option>
        </select>
      </div>
      {/* Payments Table */}
      <table className="payments-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.invoice?.id}</td>
              <td>{payment.invoice?.customer?.name || "N/A"}</td>
              <td>₹{payment.amount || payment.invoice?.totalAmount}</td>
              <td>
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Charts */}
      <div className="charts">
        <div className="chart">
          <h3>Payments Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h3>Payment Methods</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* CSS */}
      <style>{`
        .payments-container { padding: 20px; font-family: Arial, sans-serif; }
        h1 { margin-bottom: 20px; }
        .summary-cards { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .card { background: #f4f4f4; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-weight: bold; flex: 1 1 200px; }
        .filters { display: flex; justify-content: space-between; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
        .search-box { display: flex; align-items: center; border: 1px solid #ccc; padding: 5px 10px; border-radius: 5px; flex: 1; min-width: 200px; }
        .search-box input { border: none; outline: none; margin-left: 5px; flex: 1; }
        select { padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; }
        .payments-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .payments-table th, .payments-table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
        .payments-table th { background-color: #f5f5f5; font-weight: 600; }
        .payments-table tr:last-child td { border-bottom: none; }
        .charts { display: flex; gap: 20px; flex-wrap: wrap; }
        .chart { flex: 1; min-width: 300px; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .chart h3 { text-align: center; margin-bottom: 10px; }
      `}</style>
    </div>
  );
};

export default PaymentsPage;
