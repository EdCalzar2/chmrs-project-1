import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <>
            <Navbar/>
            <h1>Home Page</h1>

            <div>
                <Link to="/view_reports">View Reports</Link>
                <Link to="/report_hazard">Report Hazard</Link>
                <Link to="/emergency">Emergency</Link>
                <Link to="/">Log Out</Link>
            </div>
        </>
    )
}