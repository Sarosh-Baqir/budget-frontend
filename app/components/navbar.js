import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/apiClient";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/users/get-user")
      .then((response) => {
        //console.log(response.data.data.first_name);
        setFirstName(response.data.data.first_name);
      })
      .catch((error) => {
        console.error("Error fetching categories with labels:", error.message);
      });
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    console.log("in logout");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-300">
      {/* Left: Search Bar */}
      <div className="flex items-center space-x-2 w-96">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-2 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="p-2 rounded-lg bg-[#043927] size-9">
          <FaSearch className="text-white" />
        </button>
      </div>

      {/* Right: Profile Section */}
      <div className="flex items-center space-x-4 relative">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-semibold text-black">{firstName}</span>
          <span className="text-sm text-gray-500">Budget Manager</span>
        </div>
        <div className="relative">
          <img
            src="https://www.w3schools.com/w3images/avatar2.png"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
            onClick={toggleDropdown} // Toggle dropdown on image click
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10">
              <button
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-green-100 focus:outline-none rounded-md"
                onClick={handleLogout} // Handle logout on click
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
