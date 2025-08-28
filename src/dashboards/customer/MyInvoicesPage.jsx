import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { UserCircle2, LogOut, FileText, CreditCard } from "lucide-react";
import MyPaymentsPage from "./MyPaymentsPage";
import CustomerProfile from "./CustomerProfile";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; 



const generateInvoicePDF = (invoice) => {
  console.log("Download function triggered ✅");


  const doc = new jsPDF();

  // 🏢 Company Details
  doc.setFontSize(22);
  doc.setTextColor("#aa1bed");
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(14);
  doc.setTextColor("#000");
  doc.text("AccuBillify", 14, 30);
  doc.setFontSize(11);
  doc.text("Bangalore, India", 14, 36);
  doc.text("Mobile: 0000000000", 14, 42);
  doc.text("Email: info@accubillify.com", 14, 48);

  // 📄 Invoice Info
  doc.setTextColor("#d2277e");
  doc.text("Bill To:", 14, 60);
  doc.text("Green1 Materials LLC", 14, 66);
  doc.text("#34, Car Street", 14, 72);
  doc.text("City Park", 14, 78);
  doc.text("Hong Kong", 14, 84);

  doc.setFontSize(11);
  doc.text("Invoice No :", 145, 75);
  // FIX: Use the 'id' from the passed 'invoice' object.
  doc.text(invoice.id, 180, 75, { align: "right" })  
  doc.text("Invoice Date :", 145, 81);
  // FIX: Use the 'paidDate' from the passed 'invoice' object.
  doc.text(invoice.paidDate, 180, 81, { align: "right" })  
  doc.text("Due Date :", 145, 87);
  // FIX: Use the 'dueDate' from the passed 'invoice' object.
  doc.text(invoice.dueDate, 180, 87, { align: "right" })  
  // ✅ ✅ ✅ FIX: Correct use of autoTable via doc.autoTable
  doc.autoTable({
   startY: 95,
   head: [["Sl.", "Description", "Qty", "Rate", "Amount"]],
   body: [
     ["1", "Desktop furniture", "1", "$232.00", "$232.00"],
     ["2", "Plumbing and electrical services", "2", "$514.00", "$1028.00"],
     ["3", "Water tank repair works", "2", "$152.00", "$304.00"]
   ],
   theme: 'grid',
   headStyles: {
     fillColor: "#d2277e",
     textColor: "#ffffff",
     fontStyle: 'bold',
     halign: 'center'
   },
   styles: {
     halign: 'center',
     cellPadding: 4
   }
  });
  const finalY = doc.lastAutoTable.finalY + 10;

  // === Totals Section ===
  doc.setFontSize(11);
  doc.text("Subtotal", 145, finalY);
  doc.text("$1,564.00", 180, finalY);

  doc.text("Total", 145, finalY + 6);
  doc.text("$1,564.00", 180, finalY + 6);

  doc.text("Paid (Jun 22, 2021)", 145, finalY + 12);
  doc.text("$232.00", 180, finalY + 12);

  doc.setTextColor("#d2277e");
  doc.text("Balance Due", 145, finalY + 18);
  doc.text("$1,332.00", 180, finalY + 18);
  doc.setTextColor("#000000");

  // === Payment Instructions ===
  doc.setFontSize(11);
  doc.setTextColor("#d2277e");
  doc.text("Payment Instructions", 14, finalY + 30);
  doc.setTextColor("#000");
  doc.text("Pay Cheque to", 14, finalY + 36);
  doc.text("John Doe", 14, finalY + 42);

  // === Footer Signature ===
  doc.text("Authorized Signatory", 150, 280);

  // === Save as PDF ===
  doc.save(`${invoice.id}_AccuBillify_Invoice.pdf`);
};



// const links = [
//     { name: "Invoices", path: "invoices" },
//     { name: "Payments", path: "payments" },
//     { name: "Profile", path: "profile" },
//   ];

const invoices = [
  {
    id: "INV-001",
    status: "Paid",
    dueDate: "2023-10-25",
    paidDate: "2023-10-26",
  },
  {
    id: "INV-002",
    status: "Pending",
    dueDate: "2023-11-15",
    paidDate: null,
  },
];

const MyInvoicesPage = () => {
  const navigate = useNavigate();
  //  const [activePage, setActivePage] = useState("dashboard");
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          // width: 100vw;
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
          background: none;
        }

        .sidebar.collapsed .sidebar-menu-item {
          justify-content: center;
          padding: 12px 0;
        } 

        .sidebar-menu-item svg {
            min-width: 20px;
            min-height: 20px;
        }
        .main-content.collapsed {
          margin-left: 0;
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
          width: 81vw;
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

        .page-content {
        width:100%;
          padding: 20px;
          color: black;
        }

        /* Container to allow full width */
.invoice-table-container {
  width: 100%;
  margin-top: 30px;
  padding: 0 20px; /* some padding from browser edges */
  box-sizing: border-box;
}

/* Table full width */
.invoice-table {
  width: 97%;   /* 🔑 full width */
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  font-size: 0.95rem;
}

/* Table Head */
.invoice-table thead {
  background: linear-gradient(125deg, #e374f4, #aa1bed);
  color: white;
  text-align: left;
}

.invoice-table th,
.invoice-table td {
  padding: 14px 18px;
  text-align: center;
}

.invoice-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
}

.invoice-table tbody tr:hover {
  background: #f9f9ff;
}

/* Status badges */
.status-paid {
  background: #d1fae5;
  color: #065f46;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Action links */
.download-link {
  color: #6c63ff;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.download-link:hover {
  color: #4f46e5;
}

.sidebar-menu-item.active {
  background-color: #1f2937; 
  color: #ffffff; 
}



        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            height: 100%;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000;
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
        {/* Sidebar */}
        

        {/* Main Content */}
        <main
          className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}
        >
          <nav className="navbar">
            {/* <div className="navbar-left"> */}
              {/* <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sidebar-toggle-btn block md:hidden"
              >
                ☰
              </button> */}
              <div className="navbar-left">
              
              My Invoices
            </div>
            {/* </div> */}
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

          <div className="page-content">
            {/* <Routes>
              <Route path="payments" element={<MyPaymentsPage />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Routes> */}
            <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
              {/* <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                My Invoices
              </h1> */}
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Paid Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td>{inv.id}</td>
                        <td>{inv.paidDate || "N/A"}</td>
                        <td>{inv.dueDate}</td>
                        <td>
                          {inv.status === "Paid" ? (
                            <span className="status-paid">Paid</span>
                          ) : (
                            <span className="status-pending">Pending</span>
                          )}
                        </td>
                        {/* <td>{inv.dueDate}</td> */}
                        
                        <td>
                          {inv.status === "Paid" ? (
                            <button
// FIX: The onClick handler must pass the current invoice object 'inv' to the function.
// This is the key change that enables the download function to use the correct data for each row.
  onClick={() => generateInvoicePDF(inv)}
  style={{ background: "none", color: "#6c63ff", fontWeight: 600, border: "none", cursor: "pointer" }}
>
  Download
</button>
                          ) : (
                            <span style={{ color: "#aaa", fontStyle: "italic" }}>
                              Not Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
            </div>
        </main>
      </div>
    </>
  );
};

export default MyInvoicesPage;