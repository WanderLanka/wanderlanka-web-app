import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavBar.jsx";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;