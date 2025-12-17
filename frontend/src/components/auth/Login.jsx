import { setUser, setLoading } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/address";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../shared/Footer";
import JobPortal from "../shared/JobPortal";
import LoadingOverlay from "../ui/LoadingOverlay";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const loading = useSelector((store) => store.auth.loading);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        {
          email,
          password,
          role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Login successful!", {
          position: "top-center",
          duration: 1000,
        });
        dispatch(setUser(res.data.user));
        navigate("/");
      }
    } catch (error) {
      toast(error.response.data.message || "Someting is wrong", {
        position: "top-center",
        duration: 1000,
      });
    } finally {
        dispatch(setLoading(false));
    }
  };
  return (
    <>
      <div className="relative h-screen w-screen">
    {loading ? <LoadingOverlay message="Wait a sec..."/> : null}
        <div className="md:hidden p-5 flex justify-center select-none md:select-auto">
         <Link to="/"> <JobPortal /></Link>
        </div>
        <div className="h-full w-full flex md:items-center justify-center bg-gray-50 select-none md:select-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            {/* Title */}
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Login</h2>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="mb-6 flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={() => setRole("student")}
                    required
                  />
                  Student
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={role === "recruiter"}
                    onChange={() => setRole("recruiter")}
                  />
                  Recruiter
                </label>
              </div>

              {/* Login Button */}
              {!loading ? (
                <div className="active:scale-110 hover:scale-105 transition-transform duration-100">
                  <button
                    type="submit"
                    className="cursor-pointer mb-4 w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex justify-center gap-2 mb-4 w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
                >
                  <Loader2 className="animate-spin" /> Please Wait
                </button>
              )}
            </form>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?
              <Link to="/signup" className="text-blue-500 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
