import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ViewReports() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Example mock data (you can replace with real data from backend later)
  const reports = [
    {
      id: 1,
      status: "Submitted",
      hazard: "Broken Street Light",
      description: "The lamp post near the park has been broken for a week.",
      severity: "Minor",
      dateSubmitted: new Date().toLocaleString(),
      photos: ["https://via.placeholder.com/150"],
    },
    {
      id: 2,
      status: "Under Review",
      hazard: "Pothole",
      description: "A man has been loitering near the bus stop at night.",
      severity: "Moderate",
      dateSubmitted: new Date().toLocaleString(),
      photos: ["https://via.placeholder.com/150"]
    },
    {
      id: 3,
      status: "Resolved",
      hazard: "Clogged Drainage",
      description: "Incident near 5th street resolved by authorities.",
      severity: "Critical",
      dateSubmitted: new Date().toLocaleString(),
      photos: ["https://via.placeholder.com/150"]
    },
    {
      id: 4,
      status: "In Progress",
      hazard: "Entangled Wires",
      description: "The camera in alley 12A is not functioning.",
      dateSubmitted: new Date().toLocaleString(),    
      severity: "Moderate",
      photos: ["https://via.placeholder.com/150"]
    },
  ];

  const filters = ["All", "Submitted", "Under Review", "In Progress", "Resolved"];

  // Filter logic
  const filteredReports =
    activeFilter === "All"
      ? reports
      : reports.filter((r) => r.status === activeFilter);

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
          filteredReports.map((report) => (
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
              {/* <div className="flex gap-2 flex-wrap">
                {report.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt="Attached"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                ))}
              </div> */}
              <p className="text-gray-500 mt-4">Date Submitted: {report.dateSubmitted}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No reports found for "{activeFilter}"
          </p>
        )}
      </div>
    </>
  );
}
