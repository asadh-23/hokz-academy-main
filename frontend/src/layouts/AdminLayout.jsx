import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
  return (
    <>
      {/* Header at the top */}
      <AdminHeader />

      {/* Main layout wrapper with sidebar and content */}
      <div className="flex min-h-[calc(100vh-70px)]">
        {/* Sidebar (fixed width) */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Footer OUTSIDE layout so it spans full width */}
      <AdminFooter />
    </>
  );
};

export default AdminLayout;

