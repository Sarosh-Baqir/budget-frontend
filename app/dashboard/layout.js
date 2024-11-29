"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaTh, FaTags, FaDollarSign, FaChartBar, FaCog } from "react-icons/fa";
import Navbar from "../components/navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navigateToView = (view) => {
    if (view === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${view}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex bg-white min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } bg-white h-full  transition-all duration-300 flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 py-4 bg-white border-b">
            <div className="flex items-center space-x-2">
              <span
                className={`text-lg font-semibold text-black ${
                  sidebarOpen ? "block" : "hidden"
                }`}
              >
                Admin Panel
              </span>
            </div>
            <button
              className="text-2xl focus:outline-none text-black"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              &#9776;
            </button>
          </div>
          <nav className="mt-4 space-y-2 px-2 flex-grow">
            {[
              // List of navigation items
              { name: "Dashboard", icon: FaTh, path: "dashboard" },
              { name: "Categories/Labels", icon: FaTags, path: "categories" },
              {
                name: "Transactions",
                icon: FaDollarSign,
                path: "transactions",
              },
              { name: "Reports", icon: FaChartBar, path: "reports" },
            ].map((item) => (
              <button
                key={item.path}
                className={`w-full flex items-center space-x-4 text-left px-4 py-3 rounded-lg text-black transition-all duration-200 font-medium ${
                  pathname === `/dashboard/${item.path}` ||
                  (item.path === "dashboard" && pathname === "/dashboard")
                    ? "bg-[#043927] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => navigateToView(item.path)}
              >
                <item.icon
                  className={`${
                    pathname === `/dashboard/${item.path}` ||
                    (item.path === "dashboard" && pathname === "/dashboard")
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                />
                <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1">{children}</div>{" "}
        </main>
      </div>
    </ProtectedRoute>
  );
}
