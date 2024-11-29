"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Get OTP, 2: Verify OTP, 3: Reset Password
  const baseURL = "http://localhost:5000/api/users";

  const handleGetOtp = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-otp/${email}`);
      toast.success(response.data.message || "OTP sent successfully!");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error sending OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${baseURL}/verify-otp`, {
        email,
        otp,
      });
      toast.success(response.data.message || "OTP verified successfully!");
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${baseURL}/forget-password`, {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.message || "Password reset successfully!");
      setStep(1); // Reset the form
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error resetting password. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h1>

        {step === 1 && (
          <div>
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            <button
              onClick={handleGetOtp}
              className="w-full bg-[#043927] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Get OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-gray-700 mb-2">OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:ring-2 focus:ring-green-400"
              placeholder="Enter the OTP"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-gray-700 mb-2">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:ring-2 focus:ring-purple-400"
              placeholder="Enter new password"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
