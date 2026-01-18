import { useState } from "react";
import { signup } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "librarian",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await signup(form);
      setSuccess("Staff account created successfully");

      setForm({
        username: "",
        email: "",
        password: "",
        role: "librarian",
      });

      // Optional redirect
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "Failed to create staff account"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register Staff
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4">{success}</p>
        )}

        <input
          name="username"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border p-2 mb-6 rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
