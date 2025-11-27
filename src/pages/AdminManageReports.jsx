import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminManageReports() {
  const location = useLocation();
  const reportsFromState = location.state?.reports;

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");

  const [reports, setReports] = useState(() => {
    try {
      const raw = localStorage.getItem("chmrs_reports");
      const persisted = raw ? JSON.parse(raw) : [];
      return reportsFromState && reportsFromState.length > 0 ? reportsFromState : persisted;
    } catch (e) {
      console.error("Failed to load persisted reports", e);
      return reportsFromState || [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("chmrs_reports", JSON.stringify(reports));
    } catch (e) {
      console.error("Failed to save reports to localStorage", e);
    }
  }, [reports]);

  // Keep this for now
  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAccept = () => {
    if (selectedIndex !== null) {
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex ? { ...report, status: "Under Review" } : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
    }
  };

  const handleMarkInProgress = () => {
    if (selectedIndex !== null) {
      if (!assignedTo.trim()) {
        alert("Please assign a worker or department before marking as In Progress.");
        return;
      }
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex
            ? {
                ...report,
                status: "In Progress",
                assignedTo: assignedTo.trim(),
                inProgressDate: new Date().toISOString(),
              }
            : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
      setAssignedTo("");
    }
  };

  const handleMarkResolved = () => {
    if (selectedIndex !== null) {
      if (!resolutionDetails.trim()) {
        alert("Please provide resolution details before marking as Resolved.");
        return;
      }
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex
            ? {
                ...report,
                status: "Resolved",
                resolutionDetails: resolutionDetails.trim(),
                resolvedDate: new Date().toISOString(),
              }
            : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
      setResolutionDetails("");
    }
  };

  const handleMarkInvalid = () => {
    if (selectedIndex !== null) {
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex ? { ...report, status: "Invalid" } : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
    }
  };

  const handleReopen = () => {
    if (selectedIndex !== null) {
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex ? { ...report, status: "Under Review" } : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
    }
  };

  const openModal = (report, index) => {
    setSelectedReport(report);
    setSelectedIndex(index);
    setShowModal(true);
    // Pre-fill fields if they exist in the report
    if (report.assignedTo) setAssignedTo(report.assignedTo);
    if (report.resolutionDetails) setResolutionDetails(report.resolutionDetails);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setSelectedIndex(null);
    setAssignedTo("");
    setResolutionDetails("");
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
          {reports.length === 0 && (
            <p className="text-gray-500 text-center mt-10">No reports submitted yet.</p>
          )}

          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-[0px_5px_5px_rgba(0,0,0,0.25)] hover:shadow-[0px_10px_15px_rgba(0,0,0,0.25)] transition ml-16 w-250"
            >
              <div className="flex items-baseline gap-x-3">
                <h1 className="font-bold uppercase">{report.hazard}</h1>

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

              {report.status && (
                <div className="flex items-center my-2">
                  <span className="text-black mr-1 font-bold">Status:</span>
                  <span
                    className={`px-2 rounded-full font-medium ${
                      report.status === "Submitted"
                        ? "text-blue-700 bg-blue-100"
                        : report.status === "Under Review"
                        ? "text-orange-700 bg-orange-100"
                        : report.status === "In Progress"
                        ? "text-purple-700 bg-purple-100"
                        : report.status === "Resolved"
                        ? "text-green-700 bg-green-100"
                        : report.status === "Invalid"
                        ? "text-red-700 bg-red-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
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
                  onClick={() => openModal(report, index)}
                  className="text-sm text-blue-700 rounded-md cursor-pointer hover:underline"
                >
                  See more
                </button>

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

      {/* MODALS - Different content based on status */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-baseline gap-x-3">
              <h3 className="text-lg font-semibold">{selectedReport.hazard}</h3>
              <h1
                className={
                  `px-3 rounded-full text-white text-sm ` +
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
                <div
                  className={`ml-1 text-sm px-2 rounded-full ${
                    selectedReport.status === "Submitted"
                      ? "text-blue-700 bg-blue-100"
                      : selectedReport.status === "Under Review"
                      ? "text-orange-700 bg-orange-100"
                      : selectedReport.status === "In Progress"
                      ? "text-purple-700 bg-purple-100"
                      : selectedReport.status === "Resolved"
                      ? "text-green-700 bg-green-100"
                      : selectedReport.status === "Invalid"
                      ? "text-red-700 bg-red-100"
                      : "text-gray-700"
                  }`}
                >
                  {selectedReport.status || "N/A"}
                </div>
              </div>

              <p className="text-sm text-gray-600 my-3">{selectedReport.description}</p>

              <div>
                <strong>Photos:</strong>
                {selectedReport.photos && selectedReport.photos.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedReport.photos.map((p, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">No photos attached</div>
                )}
              </div>

              <div className="mt-2">
                <strong>Location:</strong>
                <div className="text-sm text-gray-700">
                  {selectedReport.location || "No location selected"}
                </div>
              </div>

              <div className="mt-2">
                <strong>Date:</strong>
                <div className="text-sm text-gray-700">
                  {selectedReport.date
                    ? new Date(selectedReport.date).toLocaleString()
                    : "N/A"}
                </div>
              </div>

              {/* Show assigned worker and in progress date for In Progress and Resolved statuses */}
              {(selectedReport.status === "In Progress" || selectedReport.status === "Resolved") && (
                <>
                  {selectedReport.assignedTo && (
                    <div className="mt-2">
                      <strong>Assigned To:</strong>
                      <div className="text-sm text-gray-700">{selectedReport.assignedTo}</div>
                    </div>
                  )}
                  {selectedReport.inProgressDate && (
                    <div className="mt-2">
                      <strong>Marked In Progress:</strong>
                      <div className="text-sm text-gray-700">
                        {new Date(selectedReport.inProgressDate).toLocaleString()}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Additional fields for "Under Review" status */}
              {selectedReport.status === "Under Review" && (
                <div className="mt-4 p-3 bg-orange-50 rounded-md">
                  <div>
                    <strong className="text-orange-800">Assign To:</strong>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full mt-1 p-2 border border-orange-200 rounded-md text-sm"
                      placeholder="Enter worker name or department..."
                    />
                  </div>
                </div>
              )}

              {/* Additional fields for "In Progress" status */}
              {selectedReport.status === "In Progress" && (
                <div className="mt-4 p-3 bg-purple-50 rounded-md">
                  <strong className="text-purple-800">Resolution Details:</strong>
                  <textarea
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                    className="w-full mt-2 p-2 border border-purple-200 rounded-md text-sm"
                    rows="4"
                    placeholder="Enter resolution details, actions taken, etc..."
                  />
                </div>
              )}

              {/* Additional fields for "Resolved" status */}
              {selectedReport.status === "Resolved" && (
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <strong className="text-green-800">Resolution Details:</strong>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                    {selectedReport.resolutionDetails || "No details provided"}
                  </p>
                  <div className="mt-2">
                    <strong className="text-green-800">Resolved Date:</strong>
                    <div className="text-sm text-gray-700">
                      {selectedReport.resolvedDate
                        ? new Date(selectedReport.resolvedDate).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional fields for "Invalid" status */}
              {selectedReport.status === "Invalid" && (
                <div className="mt-4 p-3 bg-red-50 rounded-md">
                  <strong className="text-red-800">Reason for Invalidity:</strong>
                  <p className="text-sm text-gray-700 mt-1">
                    This report has been marked as invalid by the admin team.
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Action Buttons based on Status */}
            <div className="mt-6 flex justify-start gap-x-2 flex-wrap">
              {selectedReport.status === "Submitted" && (
                <>
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-[#00BC3A] text-white rounded-md cursor-pointer hover:bg-[#009d30]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleMarkInvalid}
                    className="px-4 py-2 bg-[#a52c2c] text-white rounded-md cursor-pointer hover:bg-[#8a2424]"
                  >
                    Mark as Invalid
                  </button>
                </>
              )}

              {selectedReport.status === "Under Review" && (
                <>
                  <button
                    onClick={handleMarkInProgress}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700"
                  >
                    Mark as In Progress
                  </button>
                  <button
                    onClick={handleMarkInvalid}
                    className="px-4 py-2 bg-[#a52c2c] text-white rounded-md cursor-pointer hover:bg-[#8a2424]"
                  >
                    Mark as Invalid
                  </button>
                </>
              )}

              {selectedReport.status === "In Progress" && (
                <>
                  <button
                    onClick={handleMarkResolved}
                    className="px-4 py-2 bg-[#00BC3A] text-white rounded-md cursor-pointer hover:bg-[#009d30]"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={handleMarkInvalid}
                    className="px-4 py-2 bg-[#a52c2c] text-white rounded-md cursor-pointer hover:bg-[#8a2424]"
                  >
                    Mark as Invalid
                  </button>
                </>
              )}

              {selectedReport.status === "Resolved" && (
                <button
                  onClick={handleReopen}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600"
                >
                  Reopen Report
                </button>
              )}

              {selectedReport.status === "Invalid" && (
                <button
                  onClick={handleReopen}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                >
                  Reopen as Under Review
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-[#01165A] text-white rounded-md cursor-pointer hover:bg-[#012050]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}