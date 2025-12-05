import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import osm from "../utils/osm-providers.js";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default function ViewReports() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Load reports from persisted storage (no sample fallback)
  const [reports] = useState(() => {
    try {
      const currentUserId = localStorage.getItem("currentUserId");

      if (!currentUserId) {
        return []; // No user logged in, show no reports
      }

      const raw = localStorage.getItem("chmrs_reports");
      const parsed = raw ? JSON.parse(raw) : [];

      // Filter to show only current user's reports
      const userReports = Array.isArray(parsed)
        ? parsed.filter((report) => report.userId === currentUserId)
        : [];

      return userReports;
    } catch {
      return [];
    }
  });

  const filters = [
    "All",
    "Submitted",
    "Under Review",
    "In Progress",
    "Resolved",
    "Invalid",
  ];

  // Filter logic (works with persisted reports that use `status` field)
  const filteredReports =
    activeFilter === "All"
      ? reports
      : reports.filter((r) => r.status === activeFilter);

  // modal state for read-only user modal
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const openModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
  });

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
                <h2 className="text-md font-semibold mb-1 uppercase">
                  {report.hazard}
                </h2>
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
              <p className="text-black/60 mb-4">
                {report.description && report.description.length > 100
                  ? report.description.substring(0, 60) + "..."
                  : report.description}
              </p>
              <p className="text-gray-500 mt-4 text-sm">
                Date Submitted:{" "}
                {report.dateSubmitted ||
                  (report.date
                    ? new Date(report.date).toLocaleString()
                    : "N/A")}
              </p>
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

              <p className="text-sm text-gray-600 my-3">
                {selectedReport.description}
              </p>

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
                  <ul className="space-y-2">
                    {selectedReport.photos.map((p, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">
                    No photos attached
                  </div>
                )}
              </div>

              <div className="mt-2">
                <strong>Date Submitted:</strong>
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
                    <div className="text-sm text-gray-700 mt-1">
                      {selectedReport.assignedTo || "Pending..."}
                    </div>
                  </div>
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

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#01165A] text-white rounded-md cursor-pointer hover:bg-[#012050]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
