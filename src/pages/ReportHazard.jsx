import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";

export default function ReportHazard() {
  const [activeHazard, setActiveHazard] = useState(null);
  const navigate = useNavigate();

  const hazardCategories = {
    "Infrastructure & Maintenance": [
      "Pothhole",
      "Faulty Drainage Cover",
      "Cracked Sidewalks",
      "Collapsing Wall",
    ],
    Environmental: [
      "Waterlogged Area",
      "Blocked Canals",
      "Unclean Vacant Lots",
      "Fallen Trees or Branches",
    ],
    "Sanitation & Waste Management": [
      "Overflowing Garbage",
      "Clogged Drainage",
      "Foul Odor",
      "Improper Disposal",
    ],
    "Community Facilities & Utilities": [
      "Entangled Wiring",
      "Broken Streetlights",
      "Faulty Electrical Posts",
      "Sewage Overflow",
    ],
    Others: ["Others"],
  };

  const handleContinue = () => {
    if (!activeHazard) return;

    navigate("/report_hazard_details", {
      state: { hazard: activeHazard },
    });
  };

  return (
    <>
      <Navbar />
      <div className="md:p-18 mt-28 md:mt-16 ml-4 mr-4 md:ml-2 md:mr-0">
        <h1 className="text-2xl font-bold">
          Select what best describes the hazard
        </h1>

        <div className="grid grid-col lg:grid-cols-2 gap-x-28 justify-start">
          {Object.entries(hazardCategories).map(([categoryName, hazards]) => (
            <div key={categoryName} className="mt-8">
              <h1 className="font-bold">{categoryName}</h1>

              <div className="mt-3 grid grid-cols-3 gap-4">
                {hazards.map((hazard) => (
                  <button
                    key={hazard}
                    onClick={() => setActiveHazard(hazard)}
                    className={`py-3 px-3 rounded-full text-sm transition-all cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.25)]
                      ${
                        activeHazard === hazard
                          ? "bg-[#00BC3A] text-white"
                          : "bg-white hover:bg-[#dddddd]"
                      }
                    `}
                  >
                    {hazard}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 md:mt-28 text-sm">
          For urgent help, call our emergency hotlines here
        </p>

        <button
          onClick={handleContinue}
          disabled={!activeHazard}
          className={`bg-[#00BC3A] hover:bg-[#009730] transition-all duration-300 ease-in-out py-2 px-12 rounded-full text-white mt-3 cursor-pointer mb-12 shadow-[0px_2px_5px_rgba(0,0,0,0.25)]
            ${
              !activeHazard
                ? "opacity-50 cursor-not-allowed hover:bg-[#00BC3A]"
                : ""
            }
          `}
        >
          Continue
        </button>
      </div>
    </>
  );
}
