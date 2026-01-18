import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

export default function Staff() {
  const { role } = useContext(AuthContext);

  const [staff, setStaff] = useState({
    username: "",
    email: "",
    password: "",
    role: "librarian",
  });

  // Only admin can access
  if (role !== "admin") return <p className="text-red-600">Access Denied</p>;

  // Create a new staff
  const handleCreateStaff = async () => {
    try {
      await api.post("/staff", staff);
      alert("Staff created successfully!");
      setStaff({ username: "", email: "", password: "", role: "librarian" });
    } catch (err) {
      console.error("Failed to create staff:", err.response?.data || err);
      alert("Failed to create staff: " + (err.response?.data?.message || err.message));
    }
  };

  // Update a staff member (you need to provide ID)
  const handleUpdateStaff = async (id) => {
    try {
      await api.patch(`/staff/${id}`, staff);
      alert("Staff updated successfully!");
    } catch (err) {
      console.error("Failed to update staff:", err.response?.data || err);
      alert("Failed to update staff: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete a staff member (you need to provide ID)
  const handleDeleteStaff = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      alert("Staff deleted successfully!");
    } catch (err) {
      console.error("Failed to delete staff:", err.response?.data || err);
      alert("Failed to delete staff: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Staff (Admin Only)</h1>

      <div className="mb-6 space-y-2 w-96">
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full"
          value={staff.username}
          onChange={(e) => setStaff({ ...staff, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={staff.email}
          onChange={(e) => setStaff({ ...staff, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={staff.password}
          onChange={(e) => setStaff({ ...staff, password: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={staff.role}
          onChange={(e) => setStaff({ ...staff, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreateStaff}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Staff
        </button>
        <button
          onClick={() => {
            const id = prompt("Enter Staff ID to update:");
            if (id) handleUpdateStaff(id);
          }}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Update Staff
        </button>
        <button
          onClick={() => {
            const id = prompt("Enter Staff ID to delete:");
            if (id) handleDeleteStaff(id);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete Staff
        </button>
      </div>
    </div>
  );
}
