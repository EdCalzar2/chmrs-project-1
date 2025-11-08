import Navbar from "../components/Navbar"
import Logo from "../assets/logo_white_bg_new.png"
import Background from "../assets/background_img.jpg"
import styles from '../pages/Home.module.css'
import { Link } from "react-router-dom"

export default function Home() {

    

    return (
        <>
            <Navbar />
            <div className={styles.homeContainer}>
            <img src={Logo} alt="logo" className="rounded-full w-22 h-22 mt-60 md:mt-60"/>
            <h1 className="flex justify-center text-4xl text-center text-white font-bold mt-12 mb-6 md:mt-24 md:mb-10 md:text-5xl">Making our subdivision a safer place to live in.</h1>
            <p className="flex justify-center text-center text-white mx-10 mb-6 md:mb-6">Spotted a possible hazard in your area? Let us know so we can fix it.</p>

            <div className="flex flex-col items-center gap-y-4 md:flex-row justify-center gap-x-2">
                <Link to="/view_reports" className="bg-white w-80 md:w-60 py-2 rounded-full text-center hover:bg-gray-400 transition-all duration-300 ease-in-out">View Report</Link>
                <Link to="/report_hazard" className="bg-[#00922e] w-80 md:w-60 py-2 rounded-full text-white text-center hover:bg-[#006821] transition-all duration-300 ease-in-out">Report Hazard</Link>
            </div>
            </div>
        </>
    )
}