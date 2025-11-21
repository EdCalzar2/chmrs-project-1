import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminManageReports() {
  const location = useLocation(); // Get the data from another page
  const reportsFromState = location.state?.reports; // This will contain the reports

  const [reports, setReports] = useState(() => {
    try {
      const raw = localStorage.getItem("chmrs_reports"); // Load from the local storage
      const persisted = raw ? JSON.parse(raw) : [];
      return reportsFromState && reportsFromState.length > 0 ? reportsFromState : persisted; 
    } catch (e) {
      console.error("Failed to load persisted reports", e);
      return reportsFromState || [];
    }
  });

  // Persist reports to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("chmrs_reports", JSON.stringify(reports));
    } catch (e) {
      console.error("Failed to save reports to localStorage", e);
    }
  }, [reports]);

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

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
            to="/"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Logout
          </Link>
          <hr />
        </nav>
      </div>

      {/* CONTENT */}
      <div className="ml-80 mt-28 p-4">
        <div className="grid grid-cols-1 gap-y-6">
          {/* Show No Reports */}
          {reports.length === 0 && (
            <p className="text-gray-500 text-center mt-10">No reports submitted yet.</p>
          )}

          {/* Render Submitted Reports */}
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-[0px_5px_5px_rgba(0,0,0,0.25)] hover:shadow-[0px_10px_15px_rgba(0,0,0,0.25)] transition ml-16 w-250"
            >
              <div className="flex items-baseline gap-x-4">
                <h1 className="font-bold">{report.hazard}</h1>

                {/* Severity badge */}
                <h1
                  className={
                    `px-4 py-1 rounded-full text-white ` +
                    (report.severity === "Minor"
                      ? "bg-yellow-500 border-yellow-600"
                      : report.severity === "Moderate"
                      ? "bg-orange-500 border-orange-600"
                      : "bg-red-500 border-red-600")
                  }
                >
                  {report.severity}
                </h1>

                <h1 className="text-black/50">Report ID: {index + 1}</h1>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(index)}
                  className="ml-auto text-sm text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>

              <p className="my-4">{report.description}</p>

              {/* Photos */}
              {report.photos?.length > 0 && (
                <div className="mt-4">
                  <h1 className="font-bold mb-2">Photos:</h1>
                    <div className="flex gap-3 flex-wrap">
                        {report.photos.map((photo, i) => (
                        <div key={i} className="text-center">
                            {typeof photo === "string" ? (
                            <>
                                <img
                                src={`https://via.placeholder.com/112x112?text=No+Preview`}
                                alt={photo}
                                className="w-28 h-28 object-cover rounded-lg border"
                                />
                                <div className="text-xs mt-1">{photo}</div>
                            </>
                            ) : (
                            <img
                                src={URL.createObjectURL(photo)}
                                alt="Attachment"
                                className="w-28 h-28 object-cover rounded-lg border"
                            />
                            )}
                        </div>
                        ))}
                    </div>
                </div>
              )}

              {/* Location */}
              <div className="mt-4">
                <h1 className="font-bold">Pinned Location:</h1>
                <p className="text-sm text-gray-600">
                  {report.location || "No location selected"}
                </p>
              </div>

              <h1 className="mt-4 text-black/50">
                Date:{" "}
                {report.date
                  ? new Date(report.date).toLocaleString()
                  : new Date().toLocaleDateString()}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
