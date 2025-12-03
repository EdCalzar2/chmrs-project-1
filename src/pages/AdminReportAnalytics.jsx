import { Link } from "react-router-dom";

export default function AdminReportAnalytics() {
  return (
    <>
      {/* SIDEBAR */}
      <div className="h-screen w-72 bg-[#01165A] text-white flex flex-col fixed left-0 top-0 text-center">
        <h1 className="text-lg font-bold my-20">Welcome Admin!</h1>
        <hr />

        <nav className="flex flex-col">
          <Link
            to="/admin_manage_reports"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Manage Reports
          </Link>
          <hr />
          <Link
            to="/admin_report_analytics"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Report Analytics
          </Link>
          <hr />
          <Link
            to="/admin_activity_log"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Activity Log
          </Link>
          <hr />
          <Link
            to="/"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Logout
          </Link>
          <hr />
        </nav>
      </div>
    </>
  );
}
