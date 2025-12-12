import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLogout } from "../auth/Logout";
import { Menu, SidebarClose } from "lucide-react";

export default function Sidebar({ highlightIndex }) {
  const user = useSelector((store) => store.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();

  return (
    <>
      {/* Menu Button */}
      <div className="bg-gray-50">
        <Menu
        onClick={() => setIsOpen(true)}
        className="bg-transparent cursor-pointer text-xl m-3 md:hidden"
      />
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 w-64 bg-gray-100 transform transition-transform duration-300 select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar content */}
        <div className="flex h-screen bg-gray-50">
          <aside className="w-64 bg-gray-50 shadow-lg flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between px-10 space-y-3 mt-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-purple-700">JobPortal</h1>
              <SidebarClose
                className="cursor-pointer mb-3"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                to="/"
                className={`flex items-center px-4 py-3 rounded-lg font-semibold ${
                  highlightIndex === 1
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-300 transition duration-200"
                }`}
              >
                <span className="material-icons mr-3">home</span>
                Home
              </Link>

              <Link
                to="/jobs"
                className={`flex items-center px-4 py-3 rounded-lg font-semibold ${
                  highlightIndex === 2
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-300 transition duration-200"
                }`}
              >
                <span className="material-icons mr-3">work_outline</span>
                All Jobs
              </Link>

              {user && (
                <Link
                  to="/resumepage"
                  className={`flex items-center px-4 py-3 rounded-lg font-semibold ${
                    highlightIndex === 3
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-300 transition duration-200"
                  }`}
                >
                  <span className="material-icons mr-3">description</span>
                  My Resume
                </Link>
              )}

              {user && (
                <Link
                  to="/savedjobs"
                  className={`flex items-center px-4 py-3 rounded-lg font-semibold ${
                    highlightIndex === 4
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-300 transition duration-200"
                  }`}
                >
                  <span className="material-icons mr-3">bookmark_border</span>
                  Saved Jobs
                </Link>
              )}
              {user && (
                <Link
                  to="/resumemaker"
                  className={`flex items-center px-4 py-3 rounded-lg font-semibold ${
                    highlightIndex === 5
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-300 transition duration-200"
                  }`}
                >
                  <span className="material-icons mr-3">description</span>
                  Resume Builder
                </Link>
              )}
              {(user?.role && user?.role==="recruiter") && (
                <Link
                  to="/companies"
                  className={`flex items-center px-4 py-3 rounded-lg font-semibold ${
                    highlightIndex === 6
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-300 transition duration-200"
                  }`}
                >
                  <span className="material-icons mr-3">business</span>
                  Companies
                </Link>
              )}
            </nav>
            
            
            {user && (
              <div className="px-6 py-6 border-t border-gray-200">
                <Link
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                  to="#"
                  onClick={logout}
                >
                  <span className="material-icons mr-3">logout</span>
                  Logout
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
