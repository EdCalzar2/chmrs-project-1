import React, { useMemo } from "react";
import AdminSidebar from "@/components/AdminSidebar";

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1).toLocaleString(undefined, { month: "short" });
}

export default function AdminReportAnalytics() {
  const userRole = localStorage.getItem("userRole") || "admin";

  // Load all reports (admin view)
  const reports = useMemo(() => {
    try {
      const raw = localStorage.getItem("chmrs_reports");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const totalReports = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  // Hazard type counts
  const hazardCounts = useMemo(() => {
    const map = {};
    for (const r of reports) {
      const key = (r.hazard || "Unknown").trim();
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [reports]);

  // Monthly frequency for last 6 months
  const monthly = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push(key);
    }

    const counts = Object.fromEntries(months.map((m) => [m, 0]));
    for (const r of reports) {
      const date = r.date || r.dateSubmitted || new Date();
      const key = monthKey(date);
      if (counts[key] !== undefined) counts[key]++;
    }
    return { months, counts };
  }, [reports]);

  const maxMonthly = Math.max(...Object.values(monthly.counts), 1);

  return (
    <div className="min-h-screen flex">
      <AdminSidebar role={userRole} />

      <main className="flex-1 p-8 md:ml-72 mt-12">
        {/* Center content and constrain width for better responsiveness */}
        <div className="max-w-6xl mx-auto w-full">
          <header className="mb-6 text-center md:text-left">
            <h1 className="text-[#01165A] text-2xl font-semibold">Report Analytics Dashboard</h1>
          </header>

          <div className="mb-6 flex flex-col sm:flex-row gap-6 items-stretch">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow flex-1 min-w-0">
              <div className="text-sm text-blue-100 uppercase">Total Reports</div>
              <div className="text-3xl font-bold text-white">{totalReports}</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow flex-1 min-w-0">
              <div className="text-sm text-green-100 uppercase">Resolved Cases</div>
              <div className="text-3xl font-bold text-white">{resolvedCount}</div>
            </div>
          </div>

          <section className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Hazard Frequency (last 6 months)</h2>

            <div className="w-full border border-gray-200 rounded-md p-4 bg-gray-50">
              {(() => {
                const totalMonthly = monthly.months.reduce((s, mm) => s + (monthly.counts[mm] || 0), 0);
                if (totalMonthly === 0) {
                  return (
                    <div className="w-full py-10 text-center text-gray-500">No reports in the last 6 months</div>
                  );
                }

                return (
                  <div className="w-full flex items-end gap-3 h-28 sm:h-40">
                    {monthly.months.map((m) => (
                          <div key={m} className="flex-1 flex flex-col items-center min-w-0">
                            <div className="text-sm sm:text-base font-semibold text-gray-700 mb-1">{monthly.counts[m] || 0}</div>
                        <div
                          title={`${monthly.counts[m]} reports`}
                          className="w-full bg-[#01165A] rounded-t-md transition-all"
                          style={{ height: `${(monthly.counts[m] / maxMonthly) * 100 || 6}%`, maxHeight: '100%' }}
                        />
                        <div className="text-sm text-gray-700 mt-2 truncate">{monthLabel(m)}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Hazard Types</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(hazardCounts).length === 0 ? (
                <div className="text-gray-500">No hazards reported yet.</div>
              ) : (
                Object.entries(hazardCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([hazard, count]) => (
                    <div key={hazard} className="p-4 border rounded-md flex justify-between items-center min-w-0">
                      <div className="truncate">
                        <div className="text-sm font-semibold truncate">{hazard}</div>
                        <div className="text-xs text-gray-500">{((count / totalReports) * 100 || 0).toFixed(0)}% of reports</div>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full font-semibold ml-4">{count}</div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}