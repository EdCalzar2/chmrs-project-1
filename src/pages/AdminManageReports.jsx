import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminManageReports() {
  const location = useLocation(); // Get the data from another page
  const reportsFromState = location.state?.reports; // This will contain the reports

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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
              <div className="flex items-baseline gap-x-3">
                <h1 className="font-bold uppercase">{report.hazard}</h1>

                {/* Severity badge */}
                <h1
                  className={
                    `px-3 rounded-full text-white ` +
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
              </div>

              {/* Status under hazard title */}
              
                {report.status && (
                  <div className="flex items-center my-2">
                    <span className="text-black mr-1 font-bold">Status:</span>
                    <span
                      className={`rounded-full font-medium` +
                        (report.status === "Submitted" ? "text-black" : "text-gray-600 bg-gray-100")}
                    >
                      {report.status}
                    </span>
                  </div>
                )}

              <p className="text-black/50 mb-8 text-sm">{report.description}</p>
              <h1 className="text-sm text-black/50">
                Date:{" "}
                {report.date
                  ? new Date(report.date).toLocaleString()
                  : new Date().toLocaleDateString()}
              </h1>

              <div className="flex gap-2 items-center mt-2">
                <button
                  onClick={() => { setSelectedReport(report); setShowModal(true); }}
                  className="text-sm text-blue-700 rounded-md cursor-pointer hover:underline"
                >
                  See more
                </button>
                
                {/* Instead of delete, flag as invalid */}
                <button
                  onClick={() => handleDelete(index)}
                  className="text-sm text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See More Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <div className="flex items-baseline gap-x-3">
              <h3 className="text-lg font-semibold">{selectedReport.hazard}</h3>
              <h1
                  className={
                    `px-3 rounded-full text-white ` +
                    (selectedReport.severity === "Minor"
                      ? "bg-yellow-500 border-yellow-600"
                      : selectedReport.severity === "Moderate"
                      ? "bg-orange-500 border-orange-600"
                      : "bg-red-500 border-red-600")
                  }
                >
                  {selectedReport.severity}
                </h1>
            </div>

            <div className="mt-1">
              <div className="flex items-baseline">
                <strong>Status:</strong>
                <div className="ml-1 text-sm text-gray-700">{selectedReport.status || 'N/A'}</div>
              </div>
              
              <p className="text-sm text-gray-600 my-3">{selectedReport.description}</p>

              <div className>
                <strong>Photos:</strong>
                {selectedReport.photos && selectedReport.photos.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedReport.photos.map((p, i) => (
                      <li key={i} className="text-sm text-gray-700">{p}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">No photos attached</div>
                )}
              </div>

              <div className="mt-2">
                <strong>Location:</strong>
                <div className="text-sm text-gray-700">{selectedReport.location || 'No location selected'}</div>
              </div>

              <div className="mt-2">
                <strong>Date:</strong>
                <div className="text-sm text-gray-700">{selectedReport.date ? new Date(selectedReport.date).toLocaleString() : 'N/A'}</div>
              </div>

              
            </div>

            <div className="mt-6 flex justify-start gap-x-2">
              {/* Accept button will make the report's status under review */}
              <button onClick={() => { setShowModal(false); setSelectedReport(null); }} className="px-4 py-2 bg-[#00BC3A] text-white rounded-md cursor-pointer">Accept</button>
              {/* This button will flag the report as invalid */}
              <button onClick={() => { setShowModal(false); setSelectedReport(null); }} className="px-4 py-2 bg-[#a52c2c] text-white rounded-md cursor-pointer">Mark as Invalid</button>
              {/* Closes the modal */}
              <button onClick={() => { setShowModal(false); setSelectedReport(null); }} className="px-4 py-2 bg-[#01165A] text-white rounded-md cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
