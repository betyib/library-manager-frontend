import { useEffect, useState } from "react";
import api from "../api/axios";
import { Phone, Calendar, BookOpen } from "lucide-react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "" });

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    join_date: "",
  });

  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;

      const res = await api.get("/members", { params });
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async () => {
    try {
      if (editMode) {
        await api.patch(`/members/${currentMemberId}`, {
          name: memberForm.name,
          email: memberForm.email,
          phone: memberForm.phone,
        });
      } else {
        await api.post("/members", memberForm);
      }

      setShowModal(false);
      loadMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save member");
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`/members/${id}`);
      loadMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete member");
    }
  };

  const openAddModal = () => {
    setMemberForm({ name: "", email: "", phone: "", join_date: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setMemberForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      join_date: member.join_date,
    });
    setEditMode(true);
    setCurrentMemberId(member.id);
    setShowModal(true);
  };

  const viewHistory = async (id) => {
    try {
      const res = await api.get(`/members/${id}/borrowing-history`);
      setBorrowingHistory(res.data);
      setShowHistory(true);
    } catch {
      alert("Failed to load borrowing history");
    }
  };

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-gray-500">Manage library members</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

     
    

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.email}</p>
              </div>

              
            </div>

            <div className="mt-4 text-sm space-y-2 text-gray-700">
  <div className="flex items-center gap-2">
    <Phone size={16} className="text-gray-500" />
    <span>Phone: {m.phone || "-"}</span>
  </div>

  <div className="flex items-center gap-2">
    <Calendar size={16} className="text-gray-500" />
    <span>Joined: {m.join_date}</span>
  </div>

  
</div>


            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button
                  className="border rounded-lg p-2 hover:bg-gray-100"
                  onClick={() => viewHistory(m.id)}
                  title="View History"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="border rounded-lg p-2 hover:bg-gray-100"
                  onClick={() => openEditModal(m)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="border rounded-lg p-2 hover:bg-red-50 text-red-600"
                  onClick={() => handleDeleteMember(m.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Member" : "Add Member"}
            </h2>

            <div className="space-y-2">
              <input
                className="border p-2 w-full rounded"
                placeholder="Name"
                value={memberForm.name}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                placeholder="Email"
                value={memberForm.email}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, email: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                placeholder="Phone"
                value={memberForm.phone}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, phone: e.target.value })
                }
              />
              {!editMode && (
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={memberForm.join_date}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      join_date: e.target.value,
                    })
                  }
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={handleSaveMember}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Borrowing History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Borrowing History</h2>

            {borrowingHistory.length === 0 ? (
              <p>No history found</p>
            ) : (
              borrowingHistory.map((b) => (
                <div
                  key={b.id}
                  className="border-b py-2 text-sm"
                >
                  <p className="font-medium">{b.book.title}</p>
                  <p>Borrowed: {b.borrowed_at}</p>
                  <p>Due: {b.due_date}</p>
                  <p>Returned: {b.returned_at || "-"}</p>
                </div>
              ))
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowHistory(false)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
