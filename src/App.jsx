import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import ViewReports from "./pages/ViewReports.jsx";
import ReportHazard from "./pages/ReportHazard.jsx";
import Emergency from "./pages/Emergency.jsx";
import AdminManageReports from "./pages/AdminManageReports.jsx";

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
        <Route path="/admin_manage_reports" element={<AdminManageReports/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}