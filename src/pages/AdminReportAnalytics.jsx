import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminReportAnalytics() {
  const userRole = localStorage.getItem("userRole") || "admin";
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    invalid: 0,
  });

  useEffect(() => {
    // Load reports from localStorage
    const loadStats = () => {
      try {
        const raw = localStorage.getItem("chmrs_reports");
        const reports = raw ? JSON.parse(raw) : [];

        // Calculate statistics
        const total = reports.length; // ALL reports including invalid
        const resolved = reports.filter((r) => r.status === "Resolved").length; // ONLY resolved status
        const submitted = reports.filter(
          (r) => (r.status || "Submitted") === "Submitted"
        ).length;
        const underReview = reports.filter(
          (r) => r.status === "Under Review"
        ).length;
        const inProgress = reports.filter(
          (r) => r.status === "In Progress"
        ).length;
        const invalid = reports.filter((r) => r.status === "Invalid").length;

        setStats({
          total,
          resolved,
          submitted,
          underReview,
          inProgress,
          invalid,
        });
      } catch (e) {
        console.error("Failed to load reports for analytics", e);
      }
    };

    loadStats();

    // Optional: Refresh stats every 2 seconds to catch updates from other tabs
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar
        role={userRole}
        firstName={localStorage.getItem("currentAdminFirstName") || "Admin"}
      />

      {/* CONTENT */}
      <div className="ml-82 mt-12 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#01165A] mb-8">
            Report Analytics Dashboard
          </h1>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Reports Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">
                    TOTAL REPORTS
                  </p>
                  <h2 className="text-5xl font-bold">{stats.total}</h2>
                  <p className="text-blue-100 text-sm mt-2">
                    All reports including invalid
                  </p>
                </div>
              </div>
            </div>

            {/* Resolved Reports Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-2">
                    RESOLVED REPORTS
                  </p>
                  <h2 className="text-5xl font-bold">{stats.resolved}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-[#01165A] mb-6">
              Status Breakdown
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Submitted */}
              <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
                <div className="text-blue-600 text-sm font-medium mb-1">
                  Submitted
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {stats.submitted}
                </div>
              </div>

              {/* Under Review */}
              <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
                <div className="text-orange-600 text-sm font-medium mb-1">
                  Under Review
                </div>
                <div className="text-3xl font-bold text-orange-700">
                  {stats.underReview}
                </div>
              </div>

              {/* In Progress */}
              <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
                <div className="text-amber-600 text-sm font-medium mb-1">
                  In Progress
                </div>
                <div className="text-3xl font-bold text-amber-700">
                  {stats.inProgress}
                </div>
              </div>

              {/* Invalid */}
              <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
                <div className="text-red-600 text-sm font-medium mb-1">
                  Invalid
                </div>
                <div className="text-3xl font-bold text-red-700">
                  {stats.invalid}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
