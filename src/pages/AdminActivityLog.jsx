import AdminSidebar from "../components/AdminSidebar";

export default function AdminActivityLog() {
  // Get role from localStorage
  const userRole = localStorage.getItem("userRole") || "admin";

  return (
    <>
      <AdminSidebar role={userRole} />
      {/* Your page content */}
    </>
  );
}