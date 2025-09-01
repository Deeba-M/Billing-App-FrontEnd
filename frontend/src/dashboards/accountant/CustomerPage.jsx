import React, { useEffect, useState } from "react";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import api from "../../Services/axios";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formMode, setFormMode] = useState("add"); 
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "add") {
        const { id, ...newCustomer } = formData;
        const res = await api.post("/customers", newCustomer);
        setCustomers((prev) => [...prev, res.data]);
      } else {
        const res = await api.put(`/customers/${formData.id}`, formData);
        setCustomers((prev) =>
          prev.map((c) => (c.id === formData.id ? res.data : c))
        );
      }
      setShowFormModal(false);
      setFormData({ id: "", name: "", email: "", phone: "", address: "" });
    } catch (err) {
      console.error("Error saving customer:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setFormMode("edit");
    setShowFormModal(true);
  };

  return (
    <div className="page-container p-6">
      <div className="header-container flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="title flex items-center text-xl font-bold text-gray-700">
          <Users size={24} className="mr-2 text-gray-500" />
          Customers
        </h2>
        <button
          onClick={() => {
            setFormMode("add");
            setFormData({ id: "", name: "", email: "", phone: "", address: "" });
            setShowFormModal(true);
          }}
          className="btn-primary flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <Plus size={16} className="mr-2" /> New Customer
        </button>
      </div>

      <div className="table-container overflow-x-auto border rounded shadow bg-white">
        <table className="min-w-full border-separate">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                Address
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{c.id}</td>
                  <td className="px-4 py-2 text-sm">{c.name}</td>
                  <td className="px-4 py-2 text-sm">{c.email}</td>
                  <td className="px-4 py-2 text-sm">{c.phone}</td>
                  <td className="px-4 py-2 text-sm">{c.address}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="btn-edit text-green-600 hover:text-green-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn-delete text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-500 text-sm"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showFormModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="modal-content bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              {formMode === "add" ? "Add Customer" : "Edit Customer"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border p-2 w-full rounded"
                required
              /><br></br><br></br>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border p-2 w-full rounded"
                required
              /><br></br><br></br>
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border p-2 w-full rounded"
              /><br></br><br></br>
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {formMode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
