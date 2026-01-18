import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pencil, Trash2, Search, Plus } from "lucide-react";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setLoading(true);
    try {
      const res = await api.get("/genres");
      setGenres(res.data);
    } catch (err) {
      console.error("Failed to load genres:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Genre name is required");
      return;
    }

    try {
      if (editingGenre) {
        await api.patch(`/genres/${editingGenre.id}`, { name });
      } else {
        await api.post("/genres", { name });
      }

      setShowModal(false);
      setEditingGenre(null);
      setName("");
      loadGenres();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save genre");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this genre?")) return;

    try {
      await api.delete(`/genres/${id}`);
      loadGenres();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete genre");
    }
  };

  if (loading) return <p>Loading genres...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Genres</h1>
          <p className="text-gray-500">
            Manage book genres (Admin Only)
          </p>
        </div>

        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => {
            setEditingGenre(null);
            setName("");
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          Add Genre
        </button>
      </div>

     

      {/* Genre Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {genre.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Genre ID: {genre.id}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="border rounded-lg p-2 hover:bg-gray-100"
                  onClick={() => {
                    setEditingGenre(genre);
                    setName(genre.name);
                    setShowModal(true);
                  }}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="border rounded-lg p-2 hover:bg-red-50 text-red-600"
                  onClick={() => handleDelete(genre.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingGenre ? "Edit Genre" : "Add Genre"}
            </h2>

            <input
              type="text"
              placeholder="Genre name"
              className="w-full border px-3 py-2 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => {
                  setShowModal(false);
                  setEditingGenre(null);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
