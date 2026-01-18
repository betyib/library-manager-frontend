import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <div className="text-sm text-gray-700">
        {user?.username} ({user?.role})
      </div>
    </header>
  );
}
