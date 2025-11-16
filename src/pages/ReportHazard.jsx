import Navbar from "../components/Navbar"

export default function ReportHazard() {
    return (
        <>
            <Navbar/>
            <div className="md:p-18 mt-28 md:mt-16 ml-4 md:ml-2">
                <h1 className="text-2xl mb-6 font-bold">Select what best describes the hazard</h1>

                <div className="grid grid-col lg:grid-cols-2 gap-x-28 justify-start">
                    <div>
                        <h1 className="font-bold">Infrastructure & Maintenance</h1>
                        <div className="mt-3 flex flex-wrap gap-4">
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Pothole</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Faulty Drainage Cover</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Cracked Sidewalks</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Collapsing Wall</button>
                        </div>

                    </div>

                    <div className="mt-8 lg:mt-0">
                        <h1 className="font-bold">Environmental</h1>
                        <div className="mt-3 flex flex-wrap gap-4">
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Waterlogged Area</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Blocked Canals</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50 ">Unclean Vacant Lots</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Fallen Trees or Branches</button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="font-bold">Sanitation & Waste Management</h1>
                        <div className="mt-3 flex flex-wrap gap-4">
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Overflowing Garbage</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Clogged Drainage</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50 ">Foul Odor</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Improper Disposal</button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="font-bold">Community Facilities & Utilities</h1>
                        <div className="mt-3 flex flex-wrap gap-4">
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Entangled Wiring</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Broken Streetlights</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50 ">Faulty Electrical Posts</button>
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Improper Disposal</button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="font-bold">Others</h1>
                        <div className="mt-3 flex flex-wrap gap-4">
                            <button className="bg-white hover:bg-[#dddddd] hover:shadow-md/30 transition-all duration-200 cursor-pointer py-2 px-3 rounded-full text-sm max-w-[48%] lg:w-[30%] border border-black/50">Others</button>
                        </div>
                    </div>
                </div>

                <p className="mt-16 md:mt-28 text-sm">For urgent help, call our emergency hotlines here</p>
                <button className="bg-[#00BC3A] hover:bg-[#009730] hover:shadow-md/30 transition-all duration-300 ease-in-out py-2 px-12 rounded-full text-white mt-3 cursor-pointer mb-12">Continue</button>
            </div>
        </>
        
    )
}