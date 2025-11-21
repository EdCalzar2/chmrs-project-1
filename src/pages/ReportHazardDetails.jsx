import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import Navbar from "../components/Navbar";

export default function ReportHazardDetails() {
    const location = useLocation();
    const { hazard } = location.state || {};

    const severity = ["Minor", "Moderate", "Critical"];
    const [activeSeverity, setActiveSeverity] = useState(null);

    const [files, setFiles] = useState([]);
    const [termsChecked, setTermsChecked] = useState(false);
    const [description, setDescription] = useState("");
    const locationPin = null; 
    const [submitted, setSubmitted] = useState(false);

    // Adding multiple files (photos)
    const handleChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    // Deleting files (photos)
    const removeFile = (indexToRemove) => {
        setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const submitReport = () => {
        const reportData = {
            hazard,
            description,
            severity: activeSeverity,
            photos: files.map((f) => f.name),
            location: locationPin,
            date: new Date().toISOString(),
        };

        console.log("Submitting report:", reportData);

        // Saving to localStorage (append)
        try {
            const key = "chmrs_reports";
            const raw = localStorage.getItem(key); // Retrieve what is stored at localStorage
            const existing = raw ? JSON.parse(raw) : []; // Converts string to an array
            existing.push(reportData); // Adds new report to the array
            localStorage.setItem(key, JSON.stringify(existing)); // Convert array back into string
        } catch (e) {
            console.error("Failed to persist report", e);
        }

        // Keep user on this page
        setSubmitted(true);
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
                <h2 className="mt-10 md:mt-0 text-center text-2xl font-bold">{hazard}</h2>

                {submitted && (
                    <div className="mt-4 mx-auto text-center bg-green-100 text-green-800 px-4 py-2 rounded-md w-fit">
                        Report submitted successfully.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 md:mt-10 md:justify-items-center">
                    <div>
                        <h1 className="font-bold">Choose location</h1>

                        {/* Placeholder map */}
                        <img
                            src="https://via.placeholder.com/200x200"
                            alt="Map"
                            className="w-150 h-100 border-2 border-black/50 rounded-2xl mt-3"
                        />

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
                                I confirm that all information I provided is true and accurate to the best of
                                my knowledge
                            </p>
                        </div>

                        <button
                            onClick={submitReport}
                            disabled={!termsChecked}
                            className="bg-[#00BC3A] hover:bg-[#009730] transition-all duration-300 ease-in-out py-2 px-18 rounded-full text-white cursor-pointer mb-28 shadow-[0px_2px_5px_rgba(0,0,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    </div>

                    <div>
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
                                    className="cursor-pointer bg-[#D9D9D9] hover:bg:white transition-all duration-200 px-4 py-2 rounded-md inline-block"
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
                                                <span className="ml-2 text-sm text-muted-foreground">{file.name}</span>

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
            </div>
        </>
    );
}
