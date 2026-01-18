import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  BookOpen,
  Users,
  Repeat,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {isAdmin ? "Admin Dashboard" : "Librarian Dashboard"}
          <span
            className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${
              isAdmin
                ? "bg-red-100 text-red-600"
                : "bg-gray-900 text-white"
            }`}
          >
            {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
            {role?.toUpperCase()}
          </span>
        </h1>

        <p className="text-gray-600 mt-1">
          {isAdmin
            ? "Full system access – Manage all library operations"
            : "Standard library operations – Books, members, and borrowing"}
        </p>
      </div>

      {/* Access Banner */}
      <div
        className={`flex items-start gap-3 border rounded-lg p-4 ${
          isAdmin
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-green-50 border-green-200 text-green-700"
        }`}
      >
        {isAdmin ? <ShieldCheck /> : <User />}
        <div>
          <strong>
            {isAdmin ? "Administrator Access" : "Librarian Access"}
          </strong>
          <p className="text-sm mt-1">
            {isAdmin
              ? "You have full system privileges including staff and genre management."
              : "You can manage books and members, handle borrowing operations, and view reports."}
          </p>
        </div>
      </div>

     

      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-1">Quick Actions</h2>
        <p className="text-gray-500 mb-4">
          Common library operations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ActionButton
            dark
            label="Borrow Book"
            icon={<Repeat />}
            onClick={() => navigate("/borrows")}
          />
          <ActionButton
            label="Return Book"
            icon={<Repeat />}
            onClick={() => navigate("/borrows")}
          />
          <ActionButton
            label="Add Member"
            icon={<Plus />}
            onClick={() => navigate("/members")}
          />
          <ActionButton
            label="Add Book"
            icon={<Plus />}
            onClick={() => navigate("/books")}
          />
        </div>
      </div>
    </div>
  );
}


function StatCard({ title, value, icon, danger }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p
          className={`text-2xl font-bold mt-1 ${
            danger ? "text-red-600" : ""
          }`}
        >
          {value}
        </p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
}

function ActionButton({ label, icon, onClick, dark }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 border rounded-lg py-6 font-medium hover:shadow ${
        dark
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
