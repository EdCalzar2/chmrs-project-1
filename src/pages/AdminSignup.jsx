import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminSignup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: "Please upload an image file" }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: "Image size should be less than 5MB" }));
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear photo error
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!photoFile) {
      newErrors.photo = "ID photo is required for verification";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Get existing pending registrations
    const existingRegistrations = JSON.parse(
      localStorage.getItem("pending_admin_registrations") || "[]"
    );

    // Check if email already exists
    const emailExists = existingRegistrations.some(
      reg => reg.email === formData.email
    );

    if (emailExists) {
      setErrors({ email: "This email is already registered" });
      return;
    }

    // Create new registration object
    const newRegistration = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      photo: photoPreview, // Store base64 image
      status: "pending",
      submittedDate: new Date().toISOString(),
    };

    // Save to localStorage
    existingRegistrations.push(newRegistration);
    localStorage.setItem(
      "pending_admin_registrations",
      JSON.stringify(existingRegistrations)
    );

    console.log("Registration saved:", newRegistration);
    console.log("Total registrations:", existingRegistrations.length);

    alert("Registration submitted successfully! Please wait for super admin approval.");
    navigate("/");
  };

  return (
    <>
      <div className="bg-[#01165A] h-18 w-full" />
      <div className="bg-white p-6 px-12 md:w-2/7 md:mt-12 mx-auto rounded-lg shadow-md mb-8">
        <h1 className="font-bold text-xl mt-4">ADMIN - SIGN UP</h1>
        <p className="text-sm text-gray-600">Create an account (requires super admin approval)</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 md:mt-5">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className={`border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 ${
                  errors.firstName ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b2b2b]"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className={`border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 ${
                  errors.lastName ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b2b2b]"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b2b2b]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Contact Number"
                className={`border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 ${
                  errors.contactNumber ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b2b2b]"
                }`}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b2b2b]"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`border rounded-md p-2 text-sm w-full px-4 focus:outline-none focus:ring-1 ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b2b2b]"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Photo Upload Section */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ID Photo for Verification *
              </label>
              <div className="flex flex-col items-center">
                {photoPreview ? (
                  <div className="relative w-full">
                    <img
                      src={photoPreview}
                      alt="ID Preview"
                      className="w-full h-48 object-cover rounded-md border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#01165A] transition">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-500">Click to upload photo</span>
                    <span className="text-xs text-gray-400 mt-1">(Max size: 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {errors.photo && (
                <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Please upload a clear photo of your government-issued ID or employee badge
              </p>
            </div>

            <button
              type="submit"
              className="cursor-pointer bg-[#00BC3A] text-white font-bold rounded-sm py-3 md:mt-3 uppercase text-sm hover:bg-[#008a2c] transition-all duration-300 ease-in-out"
            >
              Submit Registration
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-12 mb-6">
          Already have an account?{" "}
          <Link to="/" className="text-[#01165A] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}