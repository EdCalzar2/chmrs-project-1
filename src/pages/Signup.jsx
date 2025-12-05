import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Get existing residents
    const registeredResidents = JSON.parse(
      localStorage.getItem("registered_residents") || "[]"
    );

    // Check if email already exists
    const emailExists = registeredResidents.some(
      (resident) => resident.email === formData.email
    );

    if (emailExists) {
      alert("Email address is already registered");
      return;
    }

    // Create new resident object
    const newResident = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      role: "resident",
      registeredAt: new Date().toISOString(),
    };

    // Save to storage
    registeredResidents.push(newResident);
    localStorage.setItem(
      "registered_residents",
      JSON.stringify(registeredResidents)
    );

    alert("Registration successful! Please login with your credentials.");
    navigate("/");
  };

  return (
    <>
      <div className="bg-[#01165A] h-18 w-full" />
      <div className="bg-white p-6 px-12 md:w-2/7 md:mt-12 mx-auto rounded-lg shadow-md">
        <h1 className="font-bold text-xl mt-4">RESIDENT - SIGN UP</h1>
        <p>Create an account</p>
        <form onSubmit={handleRegister}>
          <div className="flex flex-col gap-3 md:mt-5">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <button
              type="submit"
              className="cursor-pointer bg-[#00BC3A] text-white font-bold rounded-sm py-3 md:mt-3 uppercase text-sm hover:bg-[#008a2c] transition-all duration-300 ease-in-out"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-sm text-center mt-12 mb-6 ">
          Already have an account?{" "}
          <Link to="/" className="text-[#01165A] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}
