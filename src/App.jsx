import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminSignup from "./pages/AdminSignup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import ViewReports from "./pages/ViewReports.jsx";
import ReportHazard from "./pages/ReportHazard.jsx";
import Emergency from "./pages/Emergency.jsx";
import AdminManageReports from "./pages/AdminManageReports.jsx";
import ReportHazardDetails from "./pages/ReportHazardDetails.jsx";
import AdminReportAnalytics from "./pages/AdminReportAnalytics.jsx";
import SuperAdmin from "./pages/SuperAdmin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/forgot_password" element={<ForgotPassword />}></Route>
        <Route path="/resident_signup" element={<Signup />}></Route>
        <Route path="/admin_signup" element={<AdminSignup />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/view_reports" element={<ViewReports />}></Route>
        <Route path="/report_hazard" element={<ReportHazard />}></Route>
        <Route
          path="/report_hazard_details"
          element={<ReportHazardDetails />}
        ></Route>
        <Route path="/emergency" element={<Emergency />}></Route>
        <Route path="/super_admin_page" element={<SuperAdmin />}></Route>
        <Route
          path="/admin_manage_reports"
          element={<AdminManageReports />}
        ></Route>
        <Route
          path="/admin_report_analytics"
          element={<AdminReportAnalytics />}
        ></Route>
        <Route
          path="/admin_activity_log"
          element={<AdminReportAnalytics />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
