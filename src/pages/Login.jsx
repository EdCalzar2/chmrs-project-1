import NavbarLogin_Signup from "../components/NavbarLogin_Signup"
import Logo from "../assets/logo.png"

export default function Login() {
    return (
        <>
            <NavbarLogin_Signup />
            <img src={Logo} alt="logo" className="mt-16 mx-auto w-32" />
            
            {/*Login card component*/}
            <div className="bg-white p-5 text-center w-full max-w-sm mx-auto rounded-lg drop-shadow-lg/25">
                <h1 className="font-bold text-xl my-8 tracking-wider">LOGIN</h1>
                <input type="textbox" placeholder="Email Address" className="border rounded-md p-2 text-sm w-75 mb-5"/>
                <input type="textbox" placeholder="Password" className="border rounded-md p-2 text-sm w-75"/>
                
                <a href="#" className="inline-block text-[#01165A] text-sm my-8">Forgot Password?</a>

                {/*Signin button*/}
                <button className="border border-black block bg-[#00BC3A] text-[#FFFFFF] text-sm font-bold p-2 rounded-md w-75 mx-auto cursor-pointer tracking-wider">SIGN IN</button>

                <p className="text-sm my-8">Don't have an account? <a href="#" className="text-[#01165A]">Sign up here</a></p>
            </div> 
        </>
    )
}