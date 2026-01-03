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

export default function SuperAdminPage() {
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

  // --- NEW: Filter States ---
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");

  // --- Helpers ---
  const generateReportId = () => Math.floor(100000 + Math.random() * 900000);

  const addActionToHistory = (report, actionType, additionalInfo = {}) => {
    // Super Admin is always "Super Admin"
    const currentAdminName = "Super Admin";
    const actionHistory = report.actionHistory || [];

    return [
      ...actionHistory,
      {
        action: actionType,
        by: currentAdminName,
        date: new Date().toISOString(),
        ...additionalInfo,
      },
    ];
  };

  // --- Load Reports ---
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

      return finalReports.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } catch (e) {
      console.error("Failed to load reports", e);
      return reportsFromState || [];
    }
  });

  // --- Save Reports ---
  useEffect(() => {
    try {
      localStorage.setItem("chmrs_reports", JSON.stringify(reports));
    } catch (e) {
      console.error("Failed to save reports", e);
    }
  }, [reports]);

  // --- Action Handlers ---
  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStatus = (newStatus, extraData = {}) => {
    if (selectedIndex === null) return;
    setReports((prev) =>
      prev.map((report, i) =>
        i === selectedIndex
          ? {
              ...report,
              status: newStatus,
              ...extraData,
              actionHistory: addActionToHistory(
                report, 
                newStatus === "Under Review" ? "Accepted" : 
                newStatus === "Invalid" ? "Marked as Invalid" : newStatus, 
                extraData
              ),
            }
          : report
      )
    );
    closeModal();
  };

  const handleAccept = () => handleUpdateStatus("Under Review");

  const handleMarkInProgress = () => {
    const finalAssignedTo = assignedTo === "Others" ? customDepartment.trim() : assignedTo;
    if (!finalAssignedTo) return alert("Please assign a department.");
    handleUpdateStatus("In Progress", {
      assignedTo: finalAssignedTo,
      inProgressDate: new Date().toISOString(),
    });
  };

  const handleMarkResolved = () => {
    if (!resolutionDetails.trim()) return alert("Please enter resolution details.");
    handleUpdateStatus("Resolved", {
      resolutionDetails: resolutionDetails.trim(),
      resolvedDate: new Date().toISOString(),
    });
  };

  const handleMarkInvalidStart = () => {
    setInvalidReason(selectedReport?.invalidReason || "");
    setShowInvalidModal(true);
  };

  const confirmMarkInvalid = () => {
    if (!invalidReason.trim()) return alert("Please enter a reason.");
    handleUpdateStatus("Invalid", {
      invalidReason: invalidReason.trim(),
      invalidDate: new Date().toISOString(),
    });
  };

  const handleReopen = () => {
    if (selectedIndex === null) return;
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
    closeModal();
  };

  // --- Modal Control ---
  const openModal = (report, index) => {
    setSelectedReport(report);
    setSelectedIndex(index);
    setShowModal(true);
    setAssignedTo(report.assignedTo || "");
    setCustomDepartment("");
    setResolutionDetails(report.resolutionDetails || "");
    setInvalidReason(report.invalidReason || "");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setSelectedIndex(null);
    setAssignedTo("");
    setCustomDepartment("");
    setResolutionDetails("");
    setInvalidReason("");
    setShowInvalidModal(false);
  };

  // --- NEW: Filter Logic ---
  const checkDateFilter = (reportDate) => {
    if (!reportDate) return false;
    const rDate = new Date(reportDate);
    if (isNaN(rDate.getTime())) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const rDay = new Date(rDate.getFullYear(), rDate.getMonth(), rDate.getDate());

    if (dateFilter === "All Time") return true;
    if (dateFilter === "Today") return rDay.getTime() === today.getTime();
    if (dateFilter === "This Week") {
      const start = new Date(today); start.setDate(today.getDate() - today.getDay());
      const end = new Date(today); end.setDate(today.getDate() + (6 - today.getDay()));
      return rDay >= start && rDay <= end;
    }
    if (dateFilter === "This Month") return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
    return true;
  };

  const filteredReports = reports.filter((report) => {
    if (!report) return false;
    // 1. Status
    const matchesStatus = activeFilter === "All" || (report.status || "Submitted") === activeFilter;
    // 2. Date
    const matchesDate = checkDateFilter(report.date);
    // 3. Search
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (report.hazard || "").toLowerCase().includes(q) || 
      (report.reportId || "").toString().includes(q) ||
      (report.date && new Date(report.date).toLocaleDateString().includes(q));

    return matchesStatus && matchesDate && matchesSearch;
  });

  const filterOptions = ["All", "Submitted", "Under Review", "In Progress", "Resolved", "Invalid"];
  const dateOptions = ["All Time", "Today", "This Week", "This Month"];

  return (
    <>
      {/* SIDEBAR - Role is explicitly 'superadmin' */}
      <AdminSidebar role="superadmin" />

      <div className="ml-82 mt-12 p-4">
        
        {/* --- 1. NEW SEARCH & DATE SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 max-w-4xl mx-auto border border-gray-100">
          {/* Search Input */}
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

          {/* Date Buttons */}
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

        {/* --- 2. STATUS BUTTONS --- */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex gap-x-2 md:gap-x-5 p-1">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-sm px-4 py-2 md:px-6 md:py-4 font-bold rounded-full transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-white text-[#01165A] shadow-md"
                    : "bg-[#01165A] text-white hover:bg-[#001d79]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* --- 3. REPORT LIST --- */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredReports.length === 0 ? (
             <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500">No reports found matching your criteria.</p>
               <button 
                 onClick={() => { setSearchQuery(""); setActiveFilter("All"); setDateFilter("All Time"); }}
                 className="mt-2 text-blue-600 underline text-sm hover:text-blue-800"
               >
                 Clear Filters
               </button>
             </div>
          ) : (
            filteredReports.map((report, index) => (
              <div key={report.reportId} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                {/* Header */}
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h3 className="font-bold text-lg uppercase">{report.hazard}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
                    report.severity === "Minor" ? "bg-yellow-500" :
                    report.severity === "Moderate" ? "bg-orange-500" : "bg-red-500"
                  }`}>
                    {report.severity}
                  </span>
                  <span className="text-xs text-gray-400">ID: {report.reportId}</span>
                </div>

                {/* Status */}
                <div className="mb-3">
                   <span className="text-sm font-bold text-gray-700 mr-2">Status:</span>
                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                     (report.status || "Submitted") === "Submitted" ? "bg-blue-100 text-blue-800" :
                     report.status === "Under Review" ? "bg-orange-100 text-orange-800" :
                     report.status === "In Progress" ? "bg-amber-100 text-amber-800" :
                     report.status === "Resolved" ? "bg-green-100 text-green-800" :
                     "bg-red-100 text-red-800"
                   }`}>
                     {report.status || "Submitted"}
                   </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{report.description}</p>
                <div className="text-xs text-gray-400 mb-4">
                  {report.date ? new Date(report.date).toLocaleString() : "No Date"}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => openModal(report, index)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    See Details
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-sm text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedReport.hazard}</h2>
                  <p className="text-sm text-gray-500">ID: {selectedReport.reportId}</p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Status */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <span className="font-semibold text-sm">Current Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                   (selectedReport.status || "Submitted") === "Submitted" ? "bg-blue-100 text-blue-800" :
                   selectedReport.status === "Under Review" ? "bg-orange-100 text-orange-800" :
                   selectedReport.status === "In Progress" ? "bg-amber-100 text-amber-800" :
                   selectedReport.status === "Resolved" ? "bg-green-100 text-green-800" :
                   "bg-red-100 text-red-800"
                }`}>
                  {selectedReport.status || "Submitted"}
                </span>
              </div>

              {/* Info */}
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-700">Description</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedReport.description}</p>
                </div>
                
                {/* Map */}
                {selectedReport.location?.lat && (
                  <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer center={[selectedReport.location.lat, selectedReport.location.lng]} zoom={15} style={{height:"100%", width:"100%"}} scrollWheelZoom={false}>
                      <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution}/>
                      <Marker position={[selectedReport.location.lat, selectedReport.location.lng]} />
                    </MapContainer>
                  </div>
                )}

                {/* Photos */}
                {selectedReport.photos?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReport.photos.map((p, i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded overflow-hidden border">
                         {p.data ? <img src={p.data} className="w-full h-full object-cover" alt="evidence"/> : <div className="p-2 text-xs">{typeof p === 'string' ? p : 'Image'}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* History */}
                {selectedReport.actionHistory?.length > 0 && (
                   <div className="bg-blue-50 p-3 rounded text-xs space-y-1 max-h-32 overflow-y-auto">
                     <p className="font-bold text-blue-800 mb-1">History:</p>
                     {selectedReport.actionHistory.map((act, i) => (
                       <div key={i} className="flex justify-between text-gray-600">
                         <span>{act.action} <span className="text-gray-400">by {act.by}</span></span>
                         <span>{new Date(act.date).toLocaleDateString()}</span>
                       </div>
                     ))}
                   </div>
                )}
              </div>

              {/* ACTION INPUTS */}
              <div className="mt-6 border-t pt-4">
                {selectedReport.status === "Under Review" && (
                   <div className="bg-orange-50 p-3 rounded mb-3">
                     <label className="text-xs font-bold text-orange-800 block mb-1">Assign Department</label>
                     <select className="w-full text-sm p-2 border rounded" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                       <option value="">Select...</option>
                       <option>Construction Department</option>
                       <option>Garbage Collector</option>
                       <option>Electrical Department</option>
                       <option>Water Department</option>
                       <option>Others</option>
                     </select>
                     {assignedTo === "Others" && <input className="w-full mt-2 text-sm p-2 border rounded" placeholder="Type department name..." value={customDepartment} onChange={e => setCustomDepartment(e.target.value)} />}
                   </div>
                )}
                
                {selectedReport.status === "In Progress" && (
                  <div className="bg-green-50 p-3 rounded mb-3">
                    <label className="text-xs font-bold text-green-800 block mb-1">Resolution Details</label>
                    <textarea className="w-full text-sm p-2 border rounded" rows="3" placeholder="What actions were taken?" value={resolutionDetails} onChange={e => setResolutionDetails(e.target.value)} />
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-2">
                   {selectedReport.status === "Submitted" && <button onClick={handleAccept} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Accept</button>}
                   
                   {selectedReport.status === "Under Review" && <button onClick={handleMarkInProgress} className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600">Mark In Progress</button>}
                   
                   {selectedReport.status === "In Progress" && <button onClick={handleMarkResolved} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Mark Resolved</button>}
                   
                   {["Resolved", "Invalid"].includes(selectedReport.status) && <button onClick={handleReopen} className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Reopen</button>}
                   
                   {!["Resolved", "Invalid"].includes(selectedReport.status || "") && <button onClick={handleMarkInvalidStart} className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">Invalid</button>}
                   
                   <button onClick={closeModal} className="ml-auto px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invalid Reason Modal */}
      {showInvalidModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
           <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
              <h3 className="font-bold text-lg mb-2">Mark as Invalid</h3>
              <p className="text-sm text-gray-500 mb-3">Please specify why this report is being rejected.</p>
              <textarea className="w-full border p-2 rounded text-sm h-24 mb-4" placeholder="Reason..." value={invalidReason} onChange={e => setInvalidReason(e.target.value)} />
              <div className="flex justify-end gap-2">
                 <button onClick={() => {setShowInvalidModal(false); setInvalidReason("");}} className="px-3 py-1.5 text-gray-600 bg-gray-100 rounded text-sm">Cancel</button>
                 <button onClick={confirmMarkInvalid} className="px-3 py-1.5 text-white bg-red-600 rounded text-sm">Confirm</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}