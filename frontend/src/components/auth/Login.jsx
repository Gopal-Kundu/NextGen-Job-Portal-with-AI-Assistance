import { setUser, setLoading, setNotificationCount } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/address";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../shared/Footer";
import JobPortal from "../shared/JobPortal";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((store) => store.auth.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(
          setNotificationCount(
            res.data.user?.notifications?.newMessageCount
          )
        );

        toast.success("Login successful!", {
          position: "top-center",
          duration: 1000,
        });

        navigate("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong",
        { position: "top-center", duration: 2000 }
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="p-6 flex justify-center md:hidden">
        <Link to="/">
          <JobPortal />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                required
              />
            </div>

            <div className="flex sm:flex-row gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  required
                  className="accent-black"
                />
                Student
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={role === "recruiter"}
                  onChange={() => setRole("recruiter")}
                  className="accent-black"
                />
                Recruiter
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 text-white font-medium transition hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-black hover:underline"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
