// components/LoginForm.js
"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../actions/loginAction";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    loginUser(email, password)
      .then((userData) => {
        if (userData) {
          const token = localStorage.getItem("accessToken");
          console.log("Retrieved access token from localStorage:", token);

          const refreshtoken = localStorage.getItem("refreshToken");
          console.log(
            "Retrieved refresh token from localStorage:",
            refreshtoken
          );
          toast.success("logged in successfully!");

          // Update the auth context state or navigate
          login(token);
          router.push("/dashboard");
        }
        console.log("user data: ", userData);
      })
      .catch((err) => {
        setError(err.message);
        toast.success("error logging in");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-[#043927] mb-4">
          Sign in
        </h2>
        <p className="text-center text-gray-500 mb-6">Manage your Budget</p>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-[#043927] text-white py-2 rounded-md  transition duration-150"
          >
            Sign In
          </button>
        </form>
        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <Link href="/signup" className="hover:underline text-[#043927]">
            Join now
          </Link>
          <Link
            href="/reset-password"
            className="hover:underline text-[#043927]"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
