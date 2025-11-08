import { Link, useNavigate } from "react-router-dom";
import NavbarLogin_Signup from "../components/NavbarLogin_Signup";
import Logo from "../assets/logo.png";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLogin = (e) => {
    e.preventDefault(); // prevent page reload
    if (email === "test@gmail.com" && password === "123") {
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <NavbarLogin_Signup />
      <img src={Logo} alt="logo" className="mx-auto w-24 sm:w-32 md:w-40" />

      <div className="bg-white p-6 sm:p-8 text-center w-11/12 sm:w-full max-w-sm mx-auto rounded-lg shadow-md">
        <h1 className="font-bold text-xl sm:text-2xl my-6 tracking-wider">LOGIN</h1>

        <form>
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
            onClick={handleLogin}
            className="bg-[#00BC3A] text-white text-sm font-bold p-2 rounded-md w-full max-w-xs mx-auto hover:bg-[#00a732] transition cursor-pointer"
          >
            SIGN IN
          </button>
        </form>

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
