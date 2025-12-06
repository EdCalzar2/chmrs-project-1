import { Link } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminReportAnalytics() {
  const userRole = localStorage.getItem("userRole") || "admin";

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar
        role={userRole}
        firstName={localStorage.getItem("currentAdminFirstName") || "Admin"}
      />
    </>
  );
}
