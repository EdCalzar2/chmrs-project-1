import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "../components/Navbar"


export default function ReportHazardDetails() {

    const location = useLocation();
    const { hazard } = location.state || {};

    const severity = ["Minor", "Moderate", "Critical"]
    const [activeSeverity, setActiveSeverity] = useState(null)

    return(
        <>
            <Navbar/>
            <div className="mt-24">
                <Link to="/report_hazard"><button className="ml-4 md:mt-2 md:ml-8 cursor-pointer px-10 py-2 bg-[#01165A] text-white text-sm rounded-full">Back</button></Link>
            </div>
            
            <div className="grid">
                <h2 className="mt-10 md:mt-0 text-center text-2xl font-bold">{hazard}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 md:mt-10 md:justify-items-center">
                    
                    <div>
                        <h1 className="font-bold">Choose location</h1>
                        <img 
                            src="https://via.placeholder.com/200x200" 
                            alt="Map" 
                            className="w-150 h-100 border-2 border-black rounded-2xl mt-3"
                        />


                        <h1 className="mt-8 font-bold">Tell us what happened</h1>
                        <Textarea placeholder="Describe the incident in detail." id="report_description" className="h-32 border-2 border-black rounded-2xl mt-3 mb-8"/>

                        <div className="flex items-start space-x-2">
                            <Checkbox id="terms" defaultChecked />
                            <p className="text-muted-foreground text-sm">
                                I confirm that all information I provided is true and accurate to the best of my knowledge.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <h1 className="font-bold">Severity Level</h1>
                        <div className="grid grid-cols-3 gap-x-4">
                            {severity.map((severityLevel) => (                      
                                <button
                                    key={severityLevel}
                                    onClick={() => setActiveSeverity(severityLevel)}
                                    className={`mt-3 cursor-pointer px-12 py-2 rounded-full shadow-[0px_2px_5px_rgba(0,0,0,0.25)] 
                                        ${
                                            activeSeverity === severityLevel 
                                            ? "bg-[#00BC3A] text-white"
                                            : "bg-white hover:bg-[#dddddd]"
                                        }`} 
                                >
                                    {severityLevel}
                                </button>
                            ))}
                        </div>
                        <h1 className="font-bold mt-4">Attach photos:</h1>   
                    </div>
                </div>
            </div>
                

            
        </>
    )
}