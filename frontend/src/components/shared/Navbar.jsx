import JobPortal from "./JobPortal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../auth/Logout";
import { Bell } from 'lucide-react';
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/address";
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/Jobs" },
  { name: "My resume", path: "/resumepage" },
  { name: "Saved Jobs", path: "/savedjobs" },
  { name: "Companies", path: "/companies" },
  { name: "Resume Maker", path: "/resumemaker"}
];




export default function Navbar() {
  const logout = useLogout();
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 select-none w-full h-14">
      <header className="flex justify-between items-center px-4 py-2 relative z-10">
        <div className="relative z-20">
          <JobPortal />
        </div>

        <nav className="hidden md:flex items-center gap-10 text-2xl font-semibold">
          {navLinks?.map((link, idx) => {
            if (!user && (idx === 2 || idx === 3 || idx ===4)) return null;
            else if( user?.role === "student" && (idx === 4)) return null;
            else if( user?.role === "recruiter" && (idx===2)) return null;
            return (
              <Link
                key={idx}
                className="text-gray-600 hover:text-gray-900 active:scale-90 transition-transform duration-150"
                to={link.path}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {user ? (
          <div className="flex items-center gap-5">
            {user?.role == "student" ? 
                <Bell className="cursor-pointer" onClick={()=>navigate("/notifications")}/>:""}
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200 relative z-20">
                <img
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                  src={
                    user?.profile?.profilePhoto ||
                    "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
                  }
                />
              </div>
            </PopoverTrigger>

            <PopoverContent className="bg-white rounded-lg shadow-md p-4 w-56 relative z-30">
              <div className="py-2 border-b">
                <p className="font-semibold text-gray-800">{user?.fullname}</p>
                <p className="text-sm text-gray-500">
                  {user?.profile?.bio || "No Bio"}
                </p>
              </div>

              <Link
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded"
                to="/profile"
              >
                <span className="material-icons">visibility</span>
                <span>View Profile</span>
              </Link>

              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded w-full text-left cursor-pointer"
                onClick={logout}
              >
                <span className="material-icons">logout</span>
                <span>Logout</span>
              </button>
            </PopoverContent>
          </Popover>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link to="/signup">
              <span className="p-1 px-3 bg-gray-600 rounded-2xl text-white text-lg cursor-pointer hover:bg-black transition-transform duration-150 active:scale-90">
                Sign Up
              </span>
            </Link>

            <Link to="/login">
              <span className="p-1 px-3 bg-purple-800 rounded-2xl text-white text-lg cursor-pointer hover:bg-purple-900 transition-transform duration-150 active:scale-90">
                Login
              </span>
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
