import React from "react";

import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
  return (
    <>
      {/* Main layout wrapper */}
      <div className="flex min-h-screen">
        {/* Sidebar (fixed width) */}
        <AdminSidebar />

        {/* Right side (content + header) */}
        <div className="flex flex-col flex-1 bg-gray-50">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer OUTSIDE layout so it spans full width */}
      <AdminFooter />
    </>
  );
};

export default AdminLayout;

