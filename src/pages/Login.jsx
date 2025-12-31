import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useState, useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRoleSignupModal, setShowRoleSignupModal] = useState(false);


  // Alert modal states
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  useEffect(() => {
    // Initialize super admin credentials if not already set
    const superAdminCreds = localStorage.getItem("super_admin_credentials");
    if (!superAdminCreds) {
      const defaultCreds = {
        email: import.meta.env.VITE_SUPERADMIN_EMAIL,
        password: import.meta.env.VITE_SUPERADMIN_PASSWORD
      };
      localStorage.setItem("super_admin_credentials", JSON.stringify(defaultCreds));
    }
  }, []);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Function to show alert modal
  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Super Admin login
    if (email === "superadmin" && password === "qweasd") {
      localStorage.setItem("userRole", "superadmin");
      navigate("/super_admin_page");
      return;
    }

    // Check if this is an approved admin
    const approvedAdmins = JSON.parse(
      localStorage.getItem("approved_admins") || "[]"
    );

    const adminUser = approvedAdmins.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (adminUser) {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("currentAdminId", adminUser.id);
      localStorage.setItem("currentAdminFirstName", adminUser.firstName);
      localStorage.setItem(
        "currentAdminName",
        `${adminUser.firstName} ${adminUser.lastName}`
      );
      navigate("/admin_manage_reports");
      return;
    }

    // Check if user is in pending registrations
    const pendingRegistrations = JSON.parse(
      localStorage.getItem("pending_admin_registrations") || "[]"
    );

    const pendingUser = pendingRegistrations.find(
      (reg) => reg.email === email && reg.password === password
    );

    if (pendingUser) {
      if (pendingUser.status === "pending") {
        showAlert(
          "Pending Approval",
          "Your admin registration is pending approval. Please wait for super admin verification."
        );
      } else if (pendingUser.status === "rejected") {
        showAlert(
          "Registration Rejected",
          `Your admin registration was rejected. Reason: ${
            pendingUser.rejectReason || "Not specified"
          }`
        );
      }
      return;
    }

    // Check if this is a registered resident
    const registeredResidents = JSON.parse(
      localStorage.getItem("registered_residents") || "[]"
    );

    const residentUser = registeredResidents.find(
      (resident) => resident.email === email && resident.password === password
    );

    if (residentUser) {
      localStorage.setItem("userRole", "resident");
      localStorage.setItem("currentUserId", residentUser.id);
      localStorage.setItem(
        "currentUserName",
        `${residentUser.firstName} ${residentUser.lastName}`
      );
      localStorage.setItem("currentUserEmail", residentUser.email);
      navigate("/home");
      return;
    }

    // Invalid credentials
    showAlert(
      "Invalid Credentials",
      "Invalid email or password. Please check your credentials or sign up for an account."
    );
  };

  return (
    <>
      <div className="bg-[#01165A] h-18 w-full" />
      <img src={Logo} alt="logo" className="mx-auto w-24 sm:w-32 md:w-40" />

      <div className="bg-white p-6 sm:p-8 text-center w-11/12 sm:w-full max-w-sm mx-auto rounded-lg shadow-md">
        <h1 className="font-bold text-xl sm:text-2xl my-6 tracking-wider">
          LOGIN
        </h1>

        <form onSubmit={handleLogin}>
          <div className="flex flex-col items-center space-y-4">
            <input
              type="text"
              value={email}
              onChange={handleEmail}
              placeholder="Email Address"
              className="border rounded-md p-2 text-sm w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
            <input
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="Password"
              className="border rounded-md p-2 text-sm w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
            />
          </div>

          <Link
            to="/forgot_password"
            className="inline-block text-[#01165A] text-sm my-6 hover:underline"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="bg-[#00BC3A] text-white text-sm font-bold p-2 rounded-md w-full max-w-xs mx-auto hover:bg-[#00a732] transition cursor-pointer"
          >
            SIGN IN
          </button>
        </form>

        <p className="text-sm my-6">
          Don't have an account?{" "}
          <button
            className="text-[#01165A] hover:underline cursor-pointer"
            onClick={() => setShowRoleSignupModal(true)}
          >
            Sign up here
          </button>
        </p>

        {/* Role Signup Modal */}
        {showRoleSignupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm text-center">
              <button
                className="bg-[#01165A] text-white cursor-pointer flex text-sm p-1 px-2 rounded-sm"
                onClick={() => setShowRoleSignupModal(false)}
              >
                Back
              </button>
              <div className="mt-5 grid grid-cols-1 gap-y-2">
                <Link
                  to="/resident_signup"
                  className="bg-[#01165A] text-white p-2 rounded-lg cursor-pointer hover:bg-[#001a6d] transition-colors duration-200 ease-in-out"
                >
                  Resident
                </Link>
                <Link
                  to="/admin_signup"
                  className="bg-[#01165A] text-white p-2 rounded-lg cursor-pointer hover:bg-[#001a6d] transition-colors duration-200 ease-in-out"
                >
                  Admin
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Note: Admin accounts require super admin approval
              </p>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-xl">
              <h3 className="text-lg font-bold text-[#01165A] mb-3">
                {alertTitle}
              </h3>
              <p className="text-sm text-gray-700 mb-6">{alertMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="bg-[#01165A] text-white px-6 py-2 rounded-md hover:bg-[#001a6d] transition cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
