import { useEffect, useState } from "react";
import { getBooks } from "../api/books";
import api from "../api/axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre_id: "",
    available: "",
  });

  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    published_year: "",
    available_copies: "",
    genre_id: "",
  });

  //LOAD GENRES 
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const res = await api.get("/genres");
        setGenres(res.data);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    loadGenres();
  }, []);

  //LOAD BOOKS 
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.genre_id) params.genre_id = Number(filters.genre_id);
      if (filters.available !== "")
        params.available = filters.available === "true";

      const data = await getBooks(params);
      setBooks(data);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  };

  // MODAL HANDLERS
  const openAddModal = () => {
    setBookForm({
      title: "",
      author: "",
      published_year: "",
      available_copies: "",
      genre_id: "",
    });
    setEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      published_year: book.published_year,
      available_copies: book.available_copies,
      genre_id: book.genre_id,
    });
    setEditMode(true);
    setCurrentBookId(book.id);
    setShowModal(true);
  };

  const handleSaveBook = async () => {
    try {
      const payload = {
        ...bookForm,
        published_year: Number(bookForm.published_year),
        available_copies: Number(bookForm.available_copies),
        genre_id: Number(bookForm.genre_id),
      };

      if (editMode) {
        await api.patch(`/books/${currentBookId}`, payload);
      } else {
        await api.post("/books", payload);
      }

      setShowModal(false);
      loadBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save book");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      loadBooks();
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Books</h1>
          <p className="text-gray-600">
            Manage your library's book collection
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Book
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-center">
        

        <select
          className="border rounded px-3 py-2"
          value={filters.genre_id}
          onChange={(e) =>
            setFilters({ ...filters, genre_id: e.target.value })
          }
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.available}
          onChange={(e) =>
            setFilters({ ...filters, available: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Out of Stock</option>
        </select>

        <button
          onClick={loadBooks}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {/* BOOK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => {
          const available = book.available_copies > 0;

          return (
            <div
              key={book.id}
              className="border rounded-lg p-5 bg-white flex flex-col justify-between"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {book.author}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    available
                      ? "bg-black text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {available ? "Available" : "Out of Stock"}
                </span>
              </div>

              <div className="text-sm text-gray-700 mt-4 space-y-1">
                <p>
                  <strong>Genre:</strong>{" "}
                  {book.genre?.name || "-"}
                </p>
                <p>
                  <strong>Published:</strong>{" "}
                  {book.published_year}
                </p>
                <p>
                  <strong>Available Copies:</strong>{" "}
                  {book.available_copies}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => openEditModal(book)}
                  className="border rounded p-2 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="border rounded p-2 hover:bg-red-100 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-xl font-bold">
              {editMode ? "Edit Book" : "Add Book"}
            </h2>

            <input
              className="border p-2 w-full rounded"
              placeholder="Title"
              value={bookForm.title}
              onChange={(e) =>
                setBookForm({ ...bookForm, title: e.target.value })
              }
            />
            <input
              className="border p-2 w-full rounded"
              placeholder="Author"
              value={bookForm.author}
              onChange={(e) =>
                setBookForm({ ...bookForm, author: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 w-full rounded"
              placeholder="Published Year"
              value={bookForm.published_year}
              onChange={(e) =>
                setBookForm({
                  ...bookForm,
                  published_year: e.target.value,
                })
              }
            />
            <input
              type="number"
              className="border p-2 w-full rounded"
              placeholder="Available Copies"
              value={bookForm.available_copies}
              onChange={(e) =>
                setBookForm({
                  ...bookForm,
                  available_copies: e.target.value,
                })
              }
            />
            <select
              className="border p-2 w-full rounded"
              value={bookForm.genre_id}
              onChange={(e) =>
                setBookForm({ ...bookForm, genre_id: e.target.value })
              }
            >
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBook}
                className="bg-gray-900 text-white px-4 py-2 rounded"
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
