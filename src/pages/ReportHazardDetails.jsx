import { useLocation, Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import Navbar from "../components/Navbar";

import { MapContainer, TileLayer } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import osm from "../utils/osm-providers.js";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function ReportHazardDetails() {
  const location = useLocation();
  const { hazard } = location.state || {};
  const navigate = useNavigate();

  const severity = ["Minor", "Moderate", "Critical"];
  const [activeSeverity, setActiveSeverity] = useState(null);

  const [files, setFiles] = useState([]);
  const [termsChecked, setTermsChecked] = useState(false);
  const [description, setDescription] = useState("");
  const [locationPin, setLocationPin] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Map
  const [center, setCenter] = useState({
    lat: 14.409317207568014,
    lng: 120.95662785624629,
  });
  const ZOOM_LEVEL = 17;
  const mapRef = useRef();
  const featureGroupRef = useRef();

  // Handle marker creation from draw controls
  const handleCreated = (e) => {
    const { layerType, layer } = e;

    if (layerType === "marker") {
      // Remove any existing markers before adding new one
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
      }

      // Add the new marker to the feature group
      if (featureGroupRef.current) {
        featureGroupRef.current.addLayer(layer);
      }

      const { lat, lng } = layer.getLatLng();
      setLocationPin({ lat, lng });
      console.log("Marker created at:", { lat, lng });
    }
  };

  // Handle marker edit
  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const { lat, lng } = layer.getLatLng();
        setLocationPin({ lat, lng });
        console.log("Marker edited to:", { lat, lng });
      }
    });
  };

  // Handle marker deletion
  const handleDeleted = () => {
    setLocationPin(null);
    console.log("Marker deleted");
  };

  // Adding multiple files (photos)
  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Deleting files (photos)
  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // When user confirms in the modal, perform persistence and show success modal
  const performSubmit = () => {
    // Get current logged-in user info
    const currentUserId = localStorage.getItem("currentUserId");
    const currentUserName = localStorage.getItem("currentUserName");
    const currentUserEmail = localStorage.getItem("currentUserEmail");

    if (!currentUserId) {
      alert("You must be logged in to submit a report");
      navigate("/");
      return;
    }

    const reportData = {
      id: Date.now().toString(), // Add unique report ID
      userId: currentUserId, // Link report to user
      userName: currentUserName,
      userEmail: currentUserEmail,
      hazard,
      description,
      severity: activeSeverity,
      photos: files.map((f) => f.name),
      location: locationPin,
      status: "Submitted",
      date: new Date().toISOString(),
    };

    console.log("Submitting report:", reportData);

    try {
      const key = "chmrs_reports";
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];
      existing.push(reportData);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.error("Failed to persist report", e);
    }

    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleCancelConfirm = () => setShowConfirmModal(false);
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate("/home");
  };

  return (
    <>
      <Navbar />

      <div className="mt-24">
        <Link to="/report_hazard">
          <button className="ml-4 md:mt-2 md:ml-8 cursor-pointer px-10 py-2 bg-[#01165A] hover:bg-white hover:text-black transition-all duration-300 ease-in-out text-white text-sm rounded-full shadow-[0px_2px_5px_rgba(0,0,0,0.25)]">
            Back
          </button>
        </Link>
      </div>

      <div className="grid">
        <h2 className="mt-10 md:mt-0 text-center text-2xl font-bold">
          {hazard}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 md:mt-10 md:justify-items-center gap-8 px-4">
          <div className="w-full max-w-2xl">
            <h1 className="font-bold">Mark location</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Click the marker icon in the top right to place a pin on the map
            </p>
            <div className="mt-3 h-[400px] border-2 border-black/50 rounded-2xl overflow-hidden">
              <MapContainer
                center={center}
                zoom={ZOOM_LEVEL}
                ref={mapRef}
                style={{ height: "100%", width: "100%" }}
              >
                <FeatureGroup ref={featureGroupRef}>
                  <EditControl
                    position="topright"
                    onCreated={handleCreated}
                    onEdited={handleEdited}
                    onDeleted={handleDeleted}
                    draw={{
                      rectangle: false,
                      polygon: false,
                      circle: false,
                      circlemarker: false,
                      polyline: false,
                      marker: true,
                    }}
                  />
                </FeatureGroup>
                <TileLayer
                  url={osm.maptiler.url}
                  attribution={osm.maptiler.attribution}
                />
              </MapContainer>
            </div>
            {locationPin && (
              <p className="mt-2 text-sm text-muted-foreground">
                Location: {locationPin.lat.toFixed(6)},{" "}
                {locationPin.lng.toFixed(6)}
              </p>
            )}

            <h1 className="mt-8 font-bold">Tell us what happened</h1>
            <Textarea
              placeholder="Describe the incident in detail."
              id="report_description"
              className="h-32 border-2 border-black/50 rounded-2xl mt-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex items-start space-x-2 my-12">
              <Checkbox
                id="terms"
                className="border border-black/50 transition-all duration-150"
                checked={termsChecked}
                onCheckedChange={(val) => setTermsChecked(Boolean(val))}
              />
              <p className="text-muted-foreground text-sm">
                I confirm that all information I provided is true and accurate
                to the best of my knowledge
              </p>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!termsChecked}
              className="bg-[#00BC3A] hover:bg-[#009730] transition-all duration-300 ease-in-out py-2 px-18 rounded-full text-white cursor-pointer mb-28 shadow-[0px_2px_5px_rgba(0,0,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>

          <div className="w-full max-w-2xl">
            <h1 className="font-bold">Severity Level</h1>

            <div className="grid grid-cols-3 gap-x-4">
              {severity.map((severityLevel) => {
                const activeColor =
                  severityLevel === "Minor"
                    ? "bg-yellow-500 text-white border-yellow-600"
                    : severityLevel === "Moderate"
                    ? "bg-orange-500 text-white border-orange-600"
                    : "bg-red-500 text-white border-red-600";

                return (
                  <button
                    key={severityLevel}
                    onClick={() => setActiveSeverity(severityLevel)}
                    className={`mt-3 cursor-pointer px-12 py-2 rounded-full shadow-[0px_2px_5px_rgba(0,0,0,0.25)] transition-all border ${
                      activeSeverity === severityLevel
                        ? activeColor
                        : "bg-white hover:bg-[#dddddd] border-gray-300"
                    }`}
                  >
                    {severityLevel}
                  </button>
                );
              })}
            </div>

            <div>
              <h1 className="font-bold mt-8">Attach photos:</h1>

              <div className="mt-4">
                <Label
                  htmlFor="photos"
                  className="cursor-pointer bg-[#D9D9D9] hover:bg-white transition-all duration-200 px-4 py-2 rounded-md inline-block"
                >
                  <Plus size={15} />
                </Label>

                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleChange}
                />

                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-muted p-4 border border-black/20 rounded-md"
                      >
                        <span className="ml-2 text-sm text-muted-foreground">
                          {file.name}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <h3 className="text-lg font-semibold">Confirm Submission</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to submit this report? This action will
                save the report to your device.
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={performSubmit}
                  className="px-4 py-2 rounded-md bg-[#00BC3A] text-white hover:bg-[#009730]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm text-center">
              <h3 className="text-lg font-semibold">Report Submitted</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your report was submitted successfully.
              </p>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleCloseSuccess}
                  className="px-4 py-2 rounded-md bg-[#01165A] text-white hover:bg-[#022072]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
