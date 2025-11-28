import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function ViewReports() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Load reports from persisted storage (no sample fallback)
  const [reports] = useState(() => {
    try {
      const raw = localStorage.getItem("chmrs_reports");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const filters = ["All", "Submitted", "Under Review", "In Progress", "Resolved", "Invalid"];

  // Filter logic (works with persisted reports that use `status` field)
  const filteredReports =
    activeFilter === "All"
      ? reports
      : reports.filter((r) => r.status === activeFilter);

  // modal state for read-only user modal
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (report, idx) => {
    setSelectedReport(report);
    setSelectedIndex(idx);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setSelectedIndex(null);
  };

  

  return (
    <>
      <Navbar />
      <div className="flex justify-center md:gap-x-2 mt-24 text-sm flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`py-3 px-6 rounded-full shadow-md/10 hover:shadow-md/30 transition-all duration-200 m-2 cursor-pointer ${
              activeFilter === filter
                ? "bg-[#00BC3A] text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="p-10 grid grid-col gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl p-6 shadow-[0px_5px_5px_rgba(0,0,0,0.25)] hover:shadow-[0px_10px_15px_rgba(0,0,0,0.25)] transition"
            >
            <div className="flex items-baseline gap-x-5">
              <h2 className="text-md font-semibold mb-1 uppercase">{report.hazard}</h2>
              <p
                className={`text-sm font-semibold mb-2 ${
                  report.severity === "Critical"
                    ? "text-black px-3 py-1 rounded-full bg-[#FF4242]"
                    : report.severity === "Moderate"
                    ? "text-black px-3 py-1 rounded-full bg-[#FFA600]"
                    : report.severity === "Minor"
                    ? "text-black px-3 py-1 rounded-full bg-[#15FF00]"
                    : ""
                }`}
              >
                {report.severity}
              </p>
            </div>
              <p className="text-sm text-black mb-4">
                <span className="font-semibold">Status:</span> {report.status}
              </p>
              <p className="text-gray-900 mb-6">{report.description}</p>
              <p className="text-gray-500 mt-4">Date Submitted: {report.dateSubmitted || (report.date ? new Date(report.date).toLocaleString() : 'N/A')}</p>
              <div className="flex gap-2 items-center mt-2">
                <button
                  onClick={() => openModal(report, index)}
                  className="text-sm text-blue-700 rounded-md cursor-pointer hover:underline"
                >
                  See more
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No reports found for "{activeFilter}"
          </p>
        )}
      </div>

      {/* MODALS - Different content based on status (read-only user modal) */}
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
                      <li key={i} className="text-sm text-gray-700">{p}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">No photos attached</div>
                )}
              </div>

              <div className="mt-2">
                <strong>Location:</strong>
                <div className="text-sm text-gray-700">{selectedReport.location || "No location selected"}</div>
              </div>

              <div className="mt-2">
                <strong>Date:</strong>
                <div className="text-sm text-gray-700">{selectedReport.date ? new Date(selectedReport.date).toLocaleString() : "N/A"}</div>
              </div>

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
                      <div className="text-sm text-gray-700">{new Date(selectedReport.inProgressDate).toLocaleString()}</div>
                    </div>
                  )}
                </>
              )}

              {selectedReport.status === "Under Review" && (
                <div className="mt-4 p-3 bg-orange-50 rounded-md">
                  <div>
                    <strong className="text-orange-800">Assign To:</strong>
                    <div className="text-sm text-gray-700 mt-1">{selectedReport.assignedTo || "Pending..."}</div>
                  </div>
                </div>
              )}

              {selectedReport.status === "Resolved" && (
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <strong className="text-green-800">Resolution Details:</strong>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selectedReport.resolutionDetails || "No details provided"}</p>
                  <div className="mt-2">
                    <strong className="text-green-800">Resolved Date:</strong>
                    <div className="text-sm text-gray-700">{selectedReport.resolvedDate ? new Date(selectedReport.resolvedDate).toLocaleString() : "N/A"}</div>
                  </div>
                </div>
              )}

              {selectedReport.status === "Invalid" && (
                <div className="mt-4 p-3 bg-red-50 rounded-md">
                  <strong className="text-red-800">Reason for Invalidity:</strong>
                  <p className="text-sm text-gray-700 mt-1">This report has been marked as invalid.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-[#01165A] text-white rounded-md hover:bg-[#012050]">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
      
