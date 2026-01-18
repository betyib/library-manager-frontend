import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Repeat,
  Users,
  UserCog,
  BarChart3,
  Tags,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const role = user?.role;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-700"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <aside className="w-64 min-h-screen bg-white border-r px-4 py-6 flex flex-col">
      {/* Logo */}
      <h1 className="text-xl font-bold mb-8">Library Manager</h1>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active={isActive("/dashboard")}
        />

        <NavItem
          to="/books"
          icon={<BookOpen size={18} />}
          label="Books"
          active={isActive("/books")}
        />

        <NavItem
          to="/borrows"
          icon={<Repeat size={18} />}
          label="Borrow / Return"
          active={isActive("/borrows")}
        />

       

        {role === "admin" && (
          <>
            <NavItem
              to="/staff"
              icon={<UserCog size={18} />}
              label="Staff"
              active={isActive("/staff")}
            />

            <NavItem
              to="/reports"
              icon={<BarChart3 size={18} />}
              label="Reports"
              active={isActive("/reports")}
            />
             <NavItem
          to="/genres"
          icon={<Tags size={18} />}
          label="Genres"
          active={isActive("/genres")}
        />
         <NavItem
          to="/members"
          icon={<Users size={18} />}
          label="Members"
          active={isActive("/members")}
        />
          </>
        )}

       
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 mt-4 text-red-600 hover:bg-red-50 rounded"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

/* ---------- Nav Item ---------- */
function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded transition ${active}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
