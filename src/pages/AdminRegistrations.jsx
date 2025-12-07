import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationErrorModal, setShowValidationErrorModal] =
    useState(false);
  const [showRejectionConfirmModal, setShowRejectionConfirmModal] =
    useState(false);
  const [showRemovalConfirmModal, setShowRemovalConfirmModal] = useState(false);
  const [showRemovalConfirmationDialog, setShowRemovalConfirmationDialog] =
    useState(false);
  const [registrationToRemove, setRegistrationToRemove] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all

  useEffect(() => {
    loadRegistrations();

    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadRegistrations();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadRegistrations = () => {
    const stored = localStorage.getItem("pending_admin_registrations");
    console.log("Loading registrations from localStorage:", stored);

    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("Parsed registrations:", parsed);
      setRegistrations(parsed);
    } else {
      console.log("No registrations found in localStorage");
      setRegistrations([]);
    }
  };

  const saveRegistrations = (updatedRegistrations) => {
    localStorage.setItem(
      "pending_admin_registrations",
      JSON.stringify(updatedRegistrations)
    );
    setRegistrations(updatedRegistrations);
  };

  const handleApprove = (registration) => {
    // Add to approved admins list
    const approvedAdmins = JSON.parse(
      localStorage.getItem("approved_admins") || "[]"
    );

    approvedAdmins.push({
      id: registration.id,
      email: registration.email,
      password: registration.password,
      firstName: registration.firstName,
      lastName: registration.lastName,
      contactNumber: registration.contactNumber,
      photo: registration.photo,
      approvedDate: new Date().toISOString(),
    });

    localStorage.setItem("approved_admins", JSON.stringify(approvedAdmins));

    // Update registration status
    const updated = registrations.map((reg) =>
      reg.id === registration.id
        ? { ...reg, status: "approved", approvedDate: new Date().toISOString() }
        : reg
    );

    saveRegistrations(updated);
    setShowModal(false);
    setSelectedRegistration(null);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setShowValidationErrorModal(true);
      return;
    }

    const updated = registrations.map((reg) =>
      reg.id === selectedRegistration.id
        ? {
            ...reg,
            status: "rejected",
            rejectedDate: new Date().toISOString(),
            rejectReason: rejectReason.trim(),
          }
        : reg
    );

    saveRegistrations(updated);
    setShowRejectModal(false);
    setShowModal(false);
    setSelectedRegistration(null);
    setRejectReason("");
    setShowRejectionConfirmModal(true);
    setTimeout(() => {
      setShowRejectionConfirmModal(false);
    }, 2000);
  };

  // Remove admin feature (shows confirmation dialog first)
  const handleRemoveAdmin = (registration) => {
    setRegistrationToRemove(registration);
    setShowRemovalConfirmationDialog(true);
  };

  const confirmRemoveAdmin = () => {
    if (!registrationToRemove) return;
    const registration = registrationToRemove;

    // Remove from approved_admins
    const approvedAdmins = JSON.parse(
      localStorage.getItem("approved_admins") || "[]"
    );
    const updatedApproved = approvedAdmins.filter(
      (a) => a.id !== registration.id
    );
    localStorage.setItem("approved_admins", JSON.stringify(updatedApproved));

    // Completely remove registration from pending list
    const updatedRegistrations = registrations.filter(
      (reg) => reg.id !== registration.id
    );

    saveRegistrations(updatedRegistrations);
    setShowModal(false);
    setSelectedRegistration(null);

    setShowRemovalConfirmModal(true);
    setTimeout(() => {
      setShowRemovalConfirmModal(false);
    }, 1500);

    setShowRemovalConfirmationDialog(false);
    setRegistrationToRemove(null);
  };

  const cancelRemoveAdmin = () => {
    setShowRemovalConfirmationDialog(false);
    setRegistrationToRemove(null);
  };

  const openModal = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRegistration(null);
    setRejectReason("");
    setShowRejectModal(false);
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (filter === "all") return true;
    return reg.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return styles[status] || styles.pending;
  };

  return (
    <>
      {/* SIDEBAR */}
      <div className="h-screen w-72 bg-[#01165A] text-white flex flex-col fixed left-0 top-0 text-center">
        <h1 className="text-lg font-bold my-20">Welcome Super Admin!</h1>
        <hr />

        <nav className="flex flex-col">
          <Link
            to="/super_admin_page"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Manage Reports
          </Link>
          <hr />
          <Link
            to="/admin_report_analytics"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Report Analytics
          </Link>
          <hr />
          <Link
            to="/admin_pending_signup"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Admin Registrations
          </Link>
          <hr />
          <Link
            to="/"
            className="hover:bg-white hover:text-[#01165A] transition-all duration-200 text-sm py-7"
          >
            Logout
          </Link>
          <hr />
        </nav>
      </div>

      {/* CONTENT */}
      <div className="ml-72 p-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#01165A]">
              Admin Registration Requests
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === "pending"
                  ? "bg-[#01165A] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending (
              {registrations.filter((r) => r.status === "pending").length})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === "approved"
                  ? "bg-[#01165A] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Approved (
              {registrations.filter((r) => r.status === "approved").length})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === "rejected"
                  ? "bg-[#01165A] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Rejected (
              {registrations.filter((r) => r.status === "rejected").length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === "all"
                  ? "bg-[#01165A] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({registrations.length})
            </button>
          </div>

          {/* Registrations List */}
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No {filter !== "all" ? filter : ""} registrations found.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Photo Thumbnail */}
                      <img
                        src={reg.photo}
                        alt={`${reg.firstName} ${reg.lastName}`}
                        className="w-20 h-20 object-cover rounded-md border-2 border-gray-300"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {reg.firstName} {reg.lastName}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              reg.status
                            )}`}
                          >
                            {reg.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{reg.email}</p>
                        <p className="text-sm text-gray-600">
                          {reg.contactNumber}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted:{" "}
                          {new Date(reg.submittedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => openModal(reg)}
                      className="px-4 py-2 bg-[#01165A] text-white rounded-md hover:bg-[#012050] transition text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Registration Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Photo
                </label>
                <img
                  src={selectedRegistration.photo}
                  alt="ID"
                  className="w-full h-64 object-cover rounded-md border-2 border-gray-300"
                />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      selectedRegistration.status
                    )}`}
                  >
                    {selectedRegistration.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="mt-1">
                    {selectedRegistration.firstName}{" "}
                    {selectedRegistration.lastName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1">{selectedRegistration.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <p className="mt-1">{selectedRegistration.contactNumber}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Submitted Date
                  </label>
                  <p className="mt-1">
                    {new Date(
                      selectedRegistration.submittedDate
                    ).toLocaleString()}
                  </p>
                </div>

                {selectedRegistration.approvedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Approved Date
                    </label>
                    <p className="mt-1">
                      {new Date(
                        selectedRegistration.approvedDate
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedRegistration.status === "rejected" &&
                  selectedRegistration.rejectReason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rejection Reason
                      </label>
                      <p className="mt-1 text-red-600">
                        {selectedRegistration.rejectReason}
                      </p>
                      {selectedRegistration.rejectedDate && (
                        <p className="text-xs text-gray-400 mt-1">
                          Rejected:{" "}
                          {new Date(
                            selectedRegistration.rejectedDate
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              {selectedRegistration.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(selectedRegistration)}
                    className="px-4 py-2 bg-[#00BC3A] text-white rounded-md hover:bg-[#009d30] transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}

              {/* Remove Admin Logic */}
              {selectedRegistration.status === "approved" && (
                <button
                  onClick={() => handleRemoveAdmin(selectedRegistration)}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
                >
                  Remove Admin
                </button>
              )}

              {selectedRegistration.status === "rejected" && (
                <button
                  onClick={() => handleRemoveAdmin(selectedRegistration)}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
                >
                  Remove Admin
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reason for Rejection</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this admin registration.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm h-32 resize-y focus:outline-none focus:ring-2 focus:ring-[#01165A]"
              placeholder="Enter rejection reason..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Approved
            </h2>
            <p className="text-sm text-center text-gray-600">
              Admin registration approved successfully!
            </p>
          </div>
        </div>
      )}

      {/* Validation Error Modal */}
      {showValidationErrorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 4v2"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Required Field
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Please provide a reason for rejection
            </p>
            <button
              onClick={() => setShowValidationErrorModal(false)}
              className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Rejection Confirmation Modal */}
      {showRejectionConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v2m0-10l.94-1.88A2 2 0 0015 4H9a2 2 0 00-1.94 2.12L7 8m10 0a2 2 0 11-4 0m4 0a2 2 0 00-4 0"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Rejected
            </h2>
            <p className="text-sm text-center text-gray-600">
              Admin registration rejected.
            </p>
          </div>
        </div>
      )}

      {/* Removal Confirmation Dialog (asks user to confirm deletion) */}
      {showRemovalConfirmationDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Confirm Deletion
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Are you sure you want to delete this admin permanently? This
              action cannot be undone.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={cancelRemoveAdmin}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Removal Confirmation Modal (display after deletion) */}
      {showRemovalConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Removed
            </h2>
            <p className="text-sm text-center text-gray-600">
              Admin has been permanently removed.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
