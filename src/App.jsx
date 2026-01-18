import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import BorrowRecords from "./pages/BorrowRecords";
import Genres from "./pages/Genres";
import Signup from "./pages/Signup";
import Staff from "./pages/Staff";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/borrows" element={<BorrowRecords />} />
        <Route path="/genres" element={<Genres />} />

       
        <Route
          path="/staff"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              
               <Staff />
            </RoleRoute>
          }
        />
        
      </Route>
         <Route path="/signup" element={<Signup />} />
     
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
