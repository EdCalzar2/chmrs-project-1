import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#01165A] text-white h-18 flex justify-end gap-12 items-center z-50 shadow-md">
      <Link to="/home">Home</Link>
      <Link to="/view_reports">View Report</Link>
      <Link to="/report_hazard">Report Hazard</Link>
      <Link to="/" className="mr-12">
        Log Out
      </Link>
    </div>
  );
}
