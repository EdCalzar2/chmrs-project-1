import { Link } from "react-router-dom"
import NavbarLogin_Signup from "../components/NavbarLogin_Signup"

export default function Signup() {
    return (
        <>
            <NavbarLogin_Signup/>
            <div className="bg-white p-6 px-9 md:w-2/7 md:mt-12 mx-auto rounded-lg shadow-md">
                <h1 className="font-bold text-xl">SIGN UP</h1>
                <p>Create an account</p>
                <div className="flex flex-col gap-3 md:mt-5">
                <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
                />
                <input
                    type="text"
                    placeholder="Email Address"
                    className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
                />
                <button className="cursor-pointer bg-[#00BC3A] text-white rounded-sm py-3 md:mt-3 uppercase text-sm hover:bg-[#008a2c] transition-all duration-300 ease-in-out">Register</button>
                </div>
                <p className="text-sm text-center mt-8 mb-2 ">Already have an account? <Link to="/" className="text-[#01165A] hover:underline">Sign in here</Link></p>
            </div>
        </>
    )
}