import React, { useState } from "react"
import { Link } from "react-router-dom"

function ResetPasswordModal({ isOpen, onClose }) {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (newPassword === confirmPassword) {
            // TODO: Implement password reset logic
            console.log("Password reset successful")
            onClose()
        } else {
            alert("Passwords do not match!")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm text-gray-600 mb-1">
                            New Password:
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew((s) => !s)}
                                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600"
                                aria-label={showNew ? "Hide new password" : "Show new password"}
                            >
                                {showNew ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-4a16.7 16.7 0 013.5-3.5M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">
                            Confirm Password:
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600"
                                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirm ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-4a16.7 16.7 0 013.5-3.5M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#0ea23c] text-white rounded-md hover:bg-[#0b8f31] transition-colors"
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [showResetModal, setShowResetModal] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        // In a real app, you would verify the email first
        setShowResetModal(true)
    }

    return (
        <div className="min-h-screen bg-[#e9e9e9] relative">
            {/* Blue header bar */}
            <div className="absolute top-0 left-0 w-full h-20 bg-[#01165A]" />
            
            {/* Main content */}
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-[400px] p-10 relative mt-10 min-h-[250px]">
                    <Link 
                        to="/" 
                        className="absolute top-0.5 left-0.5 w-8 h-8 bg-[#0ea23c] rounded-md flex items-center justify-center text-white hover:bg-[#0b8f31] transition-colors"
                        aria-label="Back to login"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <h2 className="text-xl font-semibold mb-6">Forgot Password</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                                Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="yourhazard@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-[#0ea23c] text-white rounded-md hover:bg-[#0b8f31] transition-colors font-medium"
                        >
                            Verify Email
                        </button>
                    </form>
                </div>
            </div>

            {/* Reset Password Modal */}
            <ResetPasswordModal 
                isOpen={showResetModal} 
                onClose={() => setShowResetModal(false)} 
            />
        </div>
    )
}