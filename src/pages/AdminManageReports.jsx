import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import osm from "../utils/osm-providers.js";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import AdminSidebar from "@/components/AdminSidebar.jsx";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function AdminManageReports() {
  const location = useLocation();
  const reportsFromState = location.state?.reports;

  // --- UI States ---
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");

  // --- Filter States ---
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");

  // --- Helper: Generate random report ID ---
  const generateReportId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // --- Helper: Add action to history ---
  const addActionToHistory = (report, actionType, additionalInfo = {}) => {
    const currentAdminName =
      localStorage.getItem("currentAdminName") || "Admin";
    const actionHistory = report.actionHistory || [];

    const newAction = {
      action: actionType,
      by: currentAdminName,
      date: new Date().toISOString(),
      ...additionalInfo,
    };

    return [...actionHistory, newAction];
  };

  // --- Initialize Reports State ---
  const [reports, setReports] = useState(() => {
    try {
      const raw = localStorage.getItem("chmrs_reports");
      let persisted = raw ? JSON.parse(raw) : [];

      // Ensure every loaded report has an ID and History array
      persisted = persisted.map((report) => ({
        ...report,
        reportId: report.reportId || generateReportId(),
        actionHistory: report.actionHistory || [],
      }));

      const finalReports =
        reportsFromState && reportsFromState.length > 0
          ? reportsFromState.map((report) => ({
              ...report,
              reportId: report.reportId || generateReportId(),
              actionHistory: report.actionHistory || [],
            }))
          : persisted;

      return finalReports.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateB - dateA;
      });
    } catch (e) {
      console.error("Failed to load persisted reports", e);
      return reportsFromState || [];
    }
  });

  // --- Sync Reports to LocalStorage ---
  useEffect(() => {
    try {
      localStorage.setItem("chmrs_reports", JSON.stringify(reports));
    } catch (e) {
      console.error("Failed to save reports to localStorage", e);
    }
  }, [reports]);

  // --- Action Handlers ---
  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAccept = () => {
    if (selectedIndex !== null) {
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex
            ? {
                ...report,
                status: "Under Review",
                actionHistory: addActionToHistory(report, "Accepted"),
              }
            : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
    }
  };

  const handleMarkInProgress = () => {
    if (selectedIndex !== null) {
      const finalAssignedTo =
        assignedTo === "Others" ? customDepartment.trim() : assignedTo;

      if (!finalAssignedTo) {
        alert(
          "Please assign a worker or department before marking as In Progress."
        );
        return;
      }
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex
            ? {
                ...report,
                status: "In Progress",
                assignedTo: finalAssignedTo,
                inProgressDate: new Date().toISOString(),
                actionHistory: addActionToHistory(
                  report,
                  "Marked as In Progress",
                  { assignedTo: finalAssignedTo }
                ),
              }
            : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
      setAssignedTo("");
      setCustomDepartment("");
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
                actionHistory: addActionToHistory(report, "Resolved", {
                  resolutionDetails: resolutionDetails.trim(),
                }),
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
    setInvalidReason(selectedReport?.invalidReason || "");
    setShowInvalidModal(true);
  };

  const confirmMarkInvalid = () => {
    if (selectedIndex === null) return;
    if (!invalidReason.trim()) {
      alert("Please provide a reason for marking this report as invalid.");
      return;
    }

    setReports((prev) =>
      prev.map((report, i) =>
        i === selectedIndex
          ? {
              ...report,
              status: "Invalid",
              invalidReason: invalidReason.trim(),
              invalidDate: new Date().toISOString(),
              actionHistory: addActionToHistory(report, "Marked as Invalid", {
                reason: invalidReason.trim(),
              }),
            }
          : report
      )
    );

    setShowInvalidModal(false);
    setShowModal(false);
    setSelectedReport(null);
    setSelectedIndex(null);
    setInvalidReason("");
  };

  const cancelMarkInvalid = () => {
    setShowInvalidModal(false);
    setInvalidReason("");
  };

  const handleReopen = () => {
    if (selectedIndex !== null) {
      setReports((prev) =>
        prev.map((report, i) =>
          i === selectedIndex
            ? {
                ...report,
                status: "Under Review",
                invalidReason: undefined,
                invalidDate: undefined,
                actionHistory: addActionToHistory(report, "Reopened"),
              }
            : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
    }
  };

  // --- UI Helpers ---
  const openModal = (report, index) => {
    setSelectedReport(report);
    setSelectedIndex(index);
    setShowModal(true);

    // Pre-fill fields if editing
    if (report.assignedTo) {
      const predefinedDepts = [
        "Construction Department",
        "Garbage Collector",
        "Electrical Department",
        "Water Department",
      ];
      if (predefinedDepts.includes(report.assignedTo)) {
        setAssignedTo(report.assignedTo);
        setCustomDepartment("");
      } else {
        setAssignedTo("Others");
        setCustomDepartment(report.assignedTo);
      }
    }

    if (report.resolutionDetails)
      setResolutionDetails(report.resolutionDetails);
    if (report.invalidReason) setInvalidReason(report.invalidReason);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setSelectedIndex(null);
    setAssignedTo("");
    setResolutionDetails("");
    setInvalidReason("");
    setShowInvalidModal(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const getFilterColorClasses = (filter) => {
    // Keep styling consistent
    return "bg-[#01165A] text-white hover:bg-[#001d79]";
  };

  // --- SAFE FILTER LOGIC ---
  const checkDateFilter = (reportDate) => {
    // Safety: If no date, it doesn't match date specific filters
    if (!reportDate) return false;

    const rDate = new Date(reportDate);
    // Safety: If date is invalid
    if (isNaN(rDate.getTime())) return false;

    const now = new Date();
    // Normalize "Today" to 00:00:00
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reportDay = new Date(
      rDate.getFullYear(),
      rDate.getMonth(),
      rDate.getDate()
    );

    if (dateFilter === "All Time") return true;

    if (dateFilter === "Today") {
      return reportDay.getTime() === today.getTime();
    }

    if (dateFilter === "This Week") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      const lastDayOfWeek = new Date(today);
      lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
      return reportDay >= firstDayOfWeek && reportDay <= lastDayOfWeek;
    }

    if (dateFilter === "This Month") {
      return (
        rDate.getMonth() === now.getMonth() &&
        rDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  };

  // --- APPLY FILTERS ---
  const filteredReports = reports.filter((report) => {
    if (!report) return false;

    // 1. Status Filter
    const statusMatch =
      activeFilter === "All"
        ? true
        : (report.status || "Submitted") === activeFilter;

    // 2. Date Filter
    const dateMatch = checkDateFilter(report.date);

    // 3. Search Filter (Safe against nulls)
    const q = searchQuery.toLowerCase().trim();
    const hazard = (report.hazard || "").toLowerCase();
    const rId = (report.reportId || "").toString();
    const rDateString = report.date
      ? new Date(report.date).toLocaleDateString()
      : "";

    const searchMatch =
      q === "" ||
      hazard.includes(q) ||
      rId.includes(q) ||
      rDateString.includes(q);

    return statusMatch && dateMatch && searchMatch;
  });

  const filterOptions = [
    "All",
    "Submitted",
    "Under Review",
    "In Progress",
    "Resolved",
    "Invalid",
  ];
  const dateFilterOptions = ["All Time", "Today", "This Week", "This Month"];

  return (
    <>
      <AdminSidebar
        role={localStorage.getItem("userRole") || "admin"}
        firstName={localStorage.getItem("currentAdminFirstName") || "Admin"}
      />

      <div className="ml-82 mt-12 p-4">
        {/* --- NEW HEADER: SEARCH & DATE --- */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search ID, Hazard, or Date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Buttons */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {dateFilterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setDateFilter(option)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  dateFilter === option
                    ? "bg-[#01165A] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* --- STATUS FILTER BUTTONS --- */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-x-5 p-1 rounded-full">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`text-sm px-6 font-bold py-4 rounded-full transition duration-150 ease-in-out ${
                  activeFilter === filter
                    ? "bg-white text-[#01165A] shadow-md"
                    : getFilterColorClasses(filter)
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* --- REPORT LIST --- */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-y-6">
            {filteredReports.length === 0 && (
              <div className="text-center mt-10 p-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                  No reports found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setDateFilter("All Time");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {filteredReports.map((report, index) => (
              <div
                key={report.reportId}
                className="bg-white rounded-2xl p-6 shadow-[0px_5px_5px_rgba(0,0,0,0.25)] hover:shadow-[0px_10px_15px_rgba(0,0,0,0.25)] transition"
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
                  <h1 className="text-black/50">
                    Report ID: {report.reportId}
                  </h1>
                </div>

                {report.status && (
                  <div className="flex items-center mt-2 mb-4">
                    <span className="text-black mr-1 font-bold">Status:</span>
                    <span
                      className={`px-2 rounded-full font-medium ${
                        (report.status || "Submitted") === "Submitted"
                          ? "text-blue-700 bg-blue-100"
                          : report.status === "Under Review"
                          ? "text-orange-700 bg-orange-100"
                          : report.status === "In Progress"
                          ? "text-white bg-amber-400"
                          : report.status === "Resolved"
                          ? "text-green-700 bg-green-100"
                          : report.status === "Invalid"
                          ? "text-red-700 bg-red-100"
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {report.status || "Submitted"}
                    </span>
                  </div>
                )}

                <p className="text-black/60 mb-4">
                  {report.description && report.description.length > 100
                    ? report.description.substring(0, 60) + "..."
                    : report.description}
                </p>
                <h1 className="text-sm text-black/50">
                  Date:{" "}
                  {report.date
                    ? new Date(report.date).toLocaleString()
                    : "N/A"}
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
      </div>

      {/* --- MODALS (Unchanged logic, just re-included for completeness) --- */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
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

            {/* Modal Content */}
            <div className="mt-1">
              <div className="flex items-baseline">
                <strong>Status:</strong>
                <div className="ml-1 text-sm text-gray-600">
                  {selectedReport.status || "Submitted"}
                </div>
              </div>
              <p className="text-sm text-gray-600 my-3">
                {selectedReport.description}
              </p>

              {/* Action History */}
              {selectedReport.actionHistory &&
                selectedReport.actionHistory.length > 0 && (
                  <div className="my-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <strong className="text-blue-800">Action History:</strong>
                    <div className="mt-3 space-y-2">
                      {selectedReport.actionHistory.map((action, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium text-gray-800">
                            {action.action}
                          </span>{" "}
                          by{" "}
                          <span className="text-blue-700">{action.by}</span>
                          <div className="text-xs text-gray-500">
                            {new Date(action.date).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Photos */}
              {selectedReport.photos && selectedReport.photos.length > 0 && (
                <div className="mt-4">
                  <strong>Photos:</strong>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {selectedReport.photos.map((photo, i) => (
                      <div key={i} className="relative group">
                        {photo.data ? (
                          <img
                            src={photo.data}
                            alt="Evidence"
                            className="w-full h-40 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="p-2 bg-gray-100 rounded">
                            {typeof photo === "string" ? photo : "Image"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {selectedReport.location &&
                selectedReport.location.lat &&
                selectedReport.location.lng && (
                  <div className="my-4">
                    <strong>Location:</strong>
                    <div className="mt-2 h-[200px] border rounded-lg overflow-hidden">
                      <MapContainer
                        center={[
                          selectedReport.location.lat,
                          selectedReport.location.lng,
                        ]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          url={osm.maptiler.url}
                          attribution={osm.maptiler.attribution}
                        />
                        <Marker
                          position={[
                            selectedReport.location.lat,
                            selectedReport.location.lng,
                          ]}
                        />
                      </MapContainer>
                    </div>
                  </div>
                )}

              {/* INPUTS BASED ON STATUS */}
              {selectedReport.status === "Under Review" && (
                <div className="mt-4 p-3 bg-orange-50 rounded-md">
                  <strong className="text-orange-800">Assign To:</strong>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full mt-2 p-2 border rounded text-sm"
                  >
                    <option value="">Select department...</option>
                    <option value="Construction Department">
                      Construction Department
                    </option>
                    <option value="Garbage Collector">Garbage Collector</option>
                    <option value="Electrical Department">
                      Electrical Department
                    </option>
                    <option value="Water Department">Water Department</option>
                    <option value="Others">Others</option>
                  </select>
                  {assignedTo === "Others" && (
                    <input
                      type="text"
                      placeholder="Custom Department"
                      className="w-full mt-2 p-2 border rounded text-sm"
                      value={customDepartment}
                      onChange={(e) => setCustomDepartment(e.target.value)}
                    />
                  )}
                </div>
              )}

              {selectedReport.status === "In Progress" && (
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <strong className="text-green-800">
                    Resolution Details:
                  </strong>
                  <textarea
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                    className="w-full mt-2 p-2 border rounded text-sm"
                    rows="3"
                  />
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedReport.status === "Submitted" && (
                <>
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleMarkInvalid}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Invalid
                  </button>
                </>
              )}
              {selectedReport.status === "Under Review" && (
                <>
                  <button
                    onClick={handleMarkInProgress}
                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={handleMarkInvalid}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Invalid
                  </button>
                </>
              )}
              {selectedReport.status === "In Progress" && (
                <button
                  onClick={handleMarkResolved}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark Resolved
                </button>
              )}
              {(selectedReport.status === "Resolved" ||
                selectedReport.status === "Invalid") && (
                <button
                  onClick={handleReopen}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Reopen
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invalid Modal */}
      {showInvalidModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold">Mark as Invalid</h3>
            <textarea
              className="w-full border p-2 mt-4 rounded h-32"
              placeholder="Reason..."
              value={invalidReason}
              onChange={(e) => setInvalidReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelMarkInvalid}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmMarkInvalid}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}