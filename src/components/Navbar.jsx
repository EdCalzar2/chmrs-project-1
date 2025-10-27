import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <>
            <div className="bg-white h-18 flex justify-end gap-12 items-center">
                    <Link to="/home">Home</Link>
                    <Link to="/view_reports">View Report</Link>
                    <Link to="/report_hazard">Report Hazard</Link>
                    <Link to="/emergency">Emergency</Link>
                    <Link to="/" className="mr-12">Log Out</Link>
            </div>
        </>
    )
}