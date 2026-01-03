import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import osm from "../utils/osm-providers.js";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import AdminSidebar from "@/components/AdminSidebar.jsx";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function AdminManageReports() {
  const location = useLocation();
  const reportsFromState = location.state?.reports;

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  // NEW: Search and Date Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");

  // Function to generate random report ID
  const generateReportId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // Helper function to add action to history
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

  const [reports, setReports] = useState(() => {
    try {
      const raw = localStorage.getItem("chmrs_reports");
      let persisted = raw ? JSON.parse(raw) : [];

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
                assignedTo: finalAssignedTo, // Changed this line
                inProgressDate: new Date().toISOString(),
                actionHistory: addActionToHistory(
                  report,
                  "Marked as In Progress",
                  {
                    assignedTo: finalAssignedTo, // Changed this line
                  }
                ),
              }
            : report
        )
      );
      setShowModal(false);
      setSelectedReport(null);
      setSelectedIndex(null);
      setAssignedTo("");
      setCustomDepartment(""); // ADD THIS LINE
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

  const openModal = (report, index) => {
    setSelectedReport(report);
    setSelectedIndex(index);
    setShowModal(true);

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

  // NEW: Date Filter Logic
  const checkDateFilter = (reportDate) => {
    if (!reportDate) return false;
    const rDate = new Date(reportDate);
    if (isNaN(rDate.getTime())) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const rDay = new Date(
      rDate.getFullYear(),
      rDate.getMonth(),
      rDate.getDate()
    );

    if (dateFilter === "All Time") return true;
    if (dateFilter === "Today") return rDay.getTime() === today.getTime();
    if (dateFilter === "This Week") {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      const end = new Date(today);
      end.setDate(today.getDate() + (6 - today.getDay()));
      return rDay >= start && rDay <= end;
    }
    if (dateFilter === "This Month") {
      return (
        rDate.getMonth() === now.getMonth() &&
        rDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  };

  const filteredReports = reports.filter((report) => {
    if (!report) return false;

    // 1. Status Filter
    const matchesStatus =
      activeFilter === "All" || (report.status || "Submitted") === activeFilter;

    // 2. Date Filter
    const matchesDate = checkDateFilter(report.date);

    // 3. Search Filter
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (report.hazard || "").toLowerCase().includes(q) ||
      (report.reportId || "").toString().includes(q) ||
      (report.date && new Date(report.date).toLocaleDateString().includes(q));

    return matchesStatus && matchesDate && matchesSearch;
  });

  const filterOptions = [
    "All",
    "Submitted",
    "Under Review",
    "In Progress",
    "Resolved",
    "Invalid",
  ];

  const dateOptions = ["All Time", "Today", "This Week", "This Month"];

  const getFilterColorClasses = (filter) => {
    switch (filter) {
      case "All":
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
      case "Submitted":
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
      case "Under Review":
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
      case "In Progress":
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
      case "Resolved":
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
      case "Invalid":
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
      default:
        return "bg-[#01165A] text-white hover:bg-[#001d79]";
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar
        role={localStorage.getItem("userRole") || "admin"}
        firstName={localStorage.getItem("currentAdminFirstName") || "Admin"}
      />

      {/* CONTENT */}
      <div className="ml-82 mt-12 p-4">
        {/* NEW: SEARCH & DATE FILTER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 max-w-4xl mx-auto border border-gray-100">
          {/* Search Input */}
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search ID, Hazard, Date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Filter Buttons */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {dateOptions.map((option) => (
              <button
                key={option}
                onClick={() => setDateFilter(option)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
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

        {/* Centered container for reports */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-y-6">
            {filteredReports.length === 0 && (
              <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">
                  No reports found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                    setDateFilter("All Time");
                  }}
                  className="mt-2 text-blue-600 underline text-sm hover:text-blue-800"
                >
                  Clear All Filters
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
      </div>

      {/* MODALS - Different content based on status */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    (selectedReport.status || "Submitted") === "Submitted"
                      ? "text-blue-700 bg-blue-100"
                      : selectedReport.status === "Under Review"
                      ? "text-orange-700 bg-orange-100"
                      : selectedReport.status === "In Progress"
                      ? "text-white bg-amber-400"
                      : selectedReport.status === "Resolved"
                      ? "text-green-700 bg-green-100"
                      : selectedReport.status === "Invalid"
                      ? "text-red-700 bg-red-100"
                      : "text-gray-700"
                  }`}
                >
                  {selectedReport.status || "Submitted"}
                </div>
              </div>

              <p className="text-sm text-gray-600 my-3">
                {selectedReport.description}
              </p>

              {/* ACTION HISTORY SECTION */}
              {selectedReport.actionHistory &&
                selectedReport.actionHistory.length > 0 && (
                  <div className="my-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <strong className="text-blue-800 flex items-center gap-2">
                      Action History:
                    </strong>
                    <div className="mt-3 space-y-2">
                      {selectedReport.actionHistory.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">
                              {action.action}
                            </span>
                            <span className="text-gray-600"> by </span>
                            <span className="font-medium text-blue-700">
                              {action.by}
                            </span>
                            {action.assignedTo && (
                              <span className="text-gray-600">
                                {" "}
                                (Assigned to: {action.assignedTo})
                              </span>
                            )}
                            <div className="text-xs text-gray-500 mt-0.5">
                              {new Date(action.date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Map Display */}
              {selectedReport.location &&
                selectedReport.location.lat &&
                selectedReport.location.lng && (
                  <div className="my-4">
                    <strong>Location:</strong>
                    <div className="mt-2 h-[300px] border-2 border-gray-300 rounded-lg overflow-hidden">
                      <MapContainer
                        center={[
                          selectedReport.location.lat,
                          selectedReport.location.lng,
                        ]}
                        zoom={17}
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
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {selectedReport.location.lat.toFixed(6)},{" "}
                      {selectedReport.location.lng.toFixed(6)}
                    </p>
                  </div>
                )}

              {!selectedReport.location && (
                <div className="my-2">
                  <strong>Location:</strong>
                  <div className="text-sm text-gray-500 mt-1">
                    No location selected
                  </div>
                </div>
              )}

              <div>
                <strong>Photos:</strong>
                {selectedReport.photos && selectedReport.photos.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {selectedReport.photos.map((photo, i) => {
                      // Handle both old format (string filenames) and new format (objects with base64 data)
                      if (typeof photo === "string") {
                        // Old format - just show filename
                        return (
                          <div
                            key={i}
                            className="text-sm text-gray-700 p-2 bg-gray-50 rounded"
                          >
                            {photo}
                          </div>
                        );
                      } else if (photo.data) {
                        // New format - show actual image
                        return (
                          <div key={i} className="relative group">
                            <img
                              src={photo.data}
                              alt={photo.name}
                              className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {photo.name}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">
                    No photos attached
                  </div>
                )}
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
              {(selectedReport.status === "In Progress" ||
                selectedReport.status === "Resolved") && (
                <>
                  {selectedReport.assignedTo && (
                    <div className="mt-2">
                      <strong>Assigned To:</strong>
                      <div className="text-sm text-gray-700">
                        {selectedReport.assignedTo}
                      </div>
                    </div>
                  )}
                  {selectedReport.inProgressDate && (
                    <div className="mt-2">
                      <strong>Marked In Progress:</strong>
                      <div className="text-sm text-gray-700">
                        {new Date(
                          selectedReport.inProgressDate
                        ).toLocaleString()}
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
                    <select
                      value={assignedTo}
                      onChange={(e) => {
                        setAssignedTo(e.target.value);
                        if (e.target.value !== "Others") {
                          setCustomDepartment("");
                        }
                      }}
                      className="w-full mt-2 p-2 border border-orange-200 rounded-md text-sm"
                    >
                      <option value="">Select department...</option>
                      <option value="Construction Department">
                        Construction Department
                      </option>
                      <option value="Garbage Collector">
                        Garbage Collector
                      </option>
                      <option value="Electrical Department">
                        Electrical Department
                      </option>
                      <option value="Water Department">Water Department</option>
                      <option value="Others">Others</option>
                    </select>

                    {assignedTo === "Others" && (
                      <input
                        type="text"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        className="w-full mt-2 p-2 border border-orange-200 rounded-md text-sm"
                        placeholder="Enter custom department name..."
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Additional fields for "In Progress" status */}
              {selectedReport.status === "In Progress" && (
                <div className="mt-4 p-3 bg-green-100 rounded-md">
                  <strong className="text-green-900">
                    Resolution Details:
                  </strong>
                  <textarea
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                    className="w-full mt-2 p-2 border border-white rounded-md text-sm"
                    rows="4"
                    placeholder="Enter resolution details, actions taken, etc..."
                  />
                </div>
              )}

              {/* Additional fields for "Resolved" status */}
              {selectedReport.status === "Resolved" && (
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <strong className="text-green-800">
                    Resolution Details:
                  </strong>
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
                  <strong className="text-red-800">
                    Reason for Invalidity:
                  </strong>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                    {selectedReport.invalidReason ||
                      "This report has been marked as invalid by the admin team."}
                  </p>
                  {selectedReport.invalidDate && (
                    <div className="mt-2">
                      <strong className="text-red-800">Marked Invalid:</strong>
                      <div className="text-sm text-gray-700">
                        {new Date(selectedReport.invalidDate).toLocaleString()}
                      </div>
                    </div>
                  )}
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
                    className="px-4 py-2 bg-amber-400 text-white rounded-md cursor-pointer hover:bg-amber-500"
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

      {/* Invalid-reason modal */}
      {showInvalidModal && selectedReport && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold">
              Reason to mark report as Invalid
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Please enter a short reason explaining why this report is invalid.
            </p>

            <textarea
              value={invalidReason}
              onChange={(e) => setInvalidReason(e.target.value)}
              className="w-full mt-4 p-3 border border-gray-200 rounded-md text-sm h-36 resize-y"
              placeholder="Enter reason here..."
            />

            <div className="mt-4 flex items-center gap-x-2 justify-end">
              <button
                onClick={cancelMarkInvalid}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmMarkInvalid}
                className="px-4 py-2 bg-[#a52c2c] text-white rounded-md cursor-pointer hover:bg-[#8a2424]"
              >
                Confirm & Mark Invalid
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
