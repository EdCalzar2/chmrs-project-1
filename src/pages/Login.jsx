import { Link, useNavigate} from "react-router-dom"
import NavbarLogin_Signup from "../components/NavbarLogin_Signup";
import Logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // Add login validation here
    // If login successful proceed to navigate
    navigate("/home");
  }

  return (
    <>
      <NavbarLogin_Signup />

      {/* Center logo */}
      <img src={Logo} alt="logo" className="mx-auto w-40 h-40 mt-16 md:w-40 md:h-40" />
      {/* w-24 = small on phones, bigger on tablet/desktop */}

      {/* Login card */}
      <div className="bg-white p-6 sm:p-8 text-center w-11/12 sm:w-full max-w-sm mx-auto rounded-lg shadow-md">
        <h1 className="font-bold text-xl sm:text-2xl my-6 tracking-wider">LOGIN</h1>

        <div className="flex flex-col items-center space-y-4">
          {/* Input fields */}
          <input
            type="text"
            placeholder="Email Address"
            className="border rounded-md p-2 text-sm w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-md p-2 text-sm w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-[#2b2b2b]"
          />
        </div>

        {/* Forgot password link */}
        <Link to="/forgot_password" className="inline-block text-[#01165A] text-sm my-6 hover:underline">
          Forgot Password?
        </Link>

        {/* Signin button */}
        <button
          onClick={handleLogin}
          className="bg-[#00BC3A] text-white text-sm font-bold p-2 rounded-md w-full max-w-xs mx-auto hover:bg-[#00a732] transition cursor-pointer">
          SIGN IN
        </button>

        <p className="text-sm my-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#01165A] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </>
  );
}
