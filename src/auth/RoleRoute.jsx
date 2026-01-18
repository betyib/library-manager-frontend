import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { role } = useContext(AuthContext);

  if (!role) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  return children;
}
