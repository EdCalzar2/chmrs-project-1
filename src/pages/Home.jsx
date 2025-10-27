import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <>
            <Navbar/>
            <h1 className="flex justify-center text-4xl text-center font-bold mt-30 mb-6 md:mt-40 md:mb-10 md:text-5xl">Making our subdivision a safer place to live in.</h1>
            <p className="flex justify-center text-center mx-10 mb-6 md:mb-6">Spotted a possible hazard in your area? Let us know so we can fix it.</p>

            <div className="flex flex-col items-center gap-y-4 md:flex-row justify-center gap-x-2">
                <Link to="/view_reports" className="bg-white w-80 md:w-60 py-2 rounded-full text-center hover:bg-gray-600 transition-all duration-300 ease-in-out">View Report</Link>
                <Link to="/report_hazard" className="bg-[#00BC3A] w-80 md:w-60 py-2 rounded-full text-white text-center hover:bg-[#008a2c] transition-all duration-300 ease-in-out">Report Hazard</Link>
            </div>
        </>
    )
}