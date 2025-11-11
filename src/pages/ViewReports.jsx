import Navbar from "../components/Navbar"

export default function ViewReports() {
    return (
    <>
        <Navbar/>
        <div className="flex justify-center p-20 md:gap-x-10 md:mt-6 text-sm">
            <button className="py-3 px-6 bg-[#00BC3A] rounded-full text-white shadow-md/30">All</button>
            <button className="py-3 px-6 bg-white rounded-full shadow-md/30">Submitted</button>
            <button className="py-3 px-6 bg-white rounded-full shadow-md/30">Under Review</button>
            <button className="py-3 px-6 bg-white rounded-full shadow-md/30">In Progress</button>
            <button className="py-3 px-6 bg-white rounded-full shadow-md/30">Resolved</button>
        </div>
        
    </>
        
    )
}