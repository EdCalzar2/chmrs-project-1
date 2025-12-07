import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white h-18 flex justify-end gap-12 items-center z-50 shadow-md">
        <Link to="/home" className="hover:scale-105 transition-transform">
          Home
        </Link>
        <Link
          to="/view_reports"
          className="hover:scale-105 transition-transform"
        >
          View Report
        </Link>
        <Link
          to="/report_hazard"
          className="hover:scale-105 transition-transform"
        >
          Report Hazard
        </Link>
        <Link to="/" className="mr-12 hover:scale-105 transition-transform">
          Log Out
        </Link>
      </div>
    </>
  );
}
