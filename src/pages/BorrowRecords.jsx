import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

export default function BorrowRecords() {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowForm, setBorrowForm] = useState({
    book_id: "",
    member_id: "",
    due_date: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, bRes, mRes] = await Promise.all([
        api.get("/borrow-records"),
        api.get("/books"),
        api.get("/members"),
      ]);
      setRecords(rRes.data);
      setBooks(bRes.data);
      setMembers(mRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- BORROW ---------------- */
  const handleBorrow = async () => {
    try {
      await api.post("/borrow-records/borrow", {
        book_id: Number(borrowForm.book_id),
        member_id: Number(borrowForm.member_id),
        due_date: borrowForm.due_date,
      });

      setShowBorrowModal(false);
      setBorrowForm({ book_id: "", member_id: "", due_date: "" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Borrow failed");
    }
  };

  /* ---------------- RETURN ---------------- */
  const handleReturn = async (id) => {
    try {
      await api.post("/borrow-records/return", {
        borrow_record_id: id,
      });

      setRecords((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, returned: true } : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  const getStatus = (r) => {
    if (r.returned) return "RETURNED";
    if (new Date(r.due_date) < new Date()) return "OVERDUE";
    return "ACTIVE";
  };

  if (loading) return <p>Loading borrow records...</p>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Borrow & Return</h1>
          <p className="text-gray-600">
            Manage book borrowing and return operations
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowBorrowModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
          >
            <ArrowLeftRight size={18} />
            Borrow Book
          </button>
        </div>
      </div>

      {/* RECORD CARDS */}
      <div className="space-y-4">
        {records.map((r) => {
          const status = getStatus(r);

          return (
            <div
              key={r.id}
              className="bg-white border rounded-lg p-5 flex justify-between items-center"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <BookOpen size={18} />
                  {r.book.title}
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <User size={14} />
                  {r.member.name}
                </div>

                <div className="flex gap-10 text-sm text-gray-700 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Borrowed:{" "}
                    {new Date(r.borrow_date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Due:{" "}
                    {new Date(r.due_date).toLocaleDateString()}
                  </div>

                  {r.returned && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      Returned:{" "}
                      {new Date(
                        r.return_date
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    status === "ACTIVE"
                      ? "bg-green-500 text-white"
                      : status === "OVERDUE"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status}
                </span>

                {!r.returned && (
                  <button
                    onClick={() => handleReturn(r.id)}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Mark as Returned
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BORROW MODAL */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-xl font-bold">Borrow Book</h2>

            <select
              className="border p-2 w-full rounded"
              value={borrowForm.book_id}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  book_id: e.target.value,
                })
              }
            >
              <option value="">Select Book</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.available_copies} available)
                </option>
              ))}
            </select>

            <select
              className="border p-2 w-full rounded"
              value={borrowForm.member_id}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  member_id: e.target.value,
                })
              }
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border p-2 w-full rounded"
              value={borrowForm.due_date}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  due_date: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBorrowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBorrow}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Borrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
