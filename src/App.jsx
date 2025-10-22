import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ViewReports from "./pages/ViewReports";
import ReportHazard from "./pages/ReportHazard";
import Emergency from "./pages/Emergency";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/forgot_password" element={<ForgotPassword/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/view_reports" element={<ViewReports/>}></Route>
        <Route path="/report_hazard" element={<ReportHazard/>}></Route>
        <Route path="/emergency" element={<Emergency/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}