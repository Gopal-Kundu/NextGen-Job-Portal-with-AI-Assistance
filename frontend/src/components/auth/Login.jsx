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
      toast(
        error?.response?.data?.message || "Something went wrong",
        { position: "top-center", duration: 1000 }
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="md:hidden p-6 flex justify-center">
          <Link to="/">
            <JobPortal />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
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
                <label className="flex items-center gap-2 cursor-pointer">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black py-2.5 text-white transition hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-black font-medium hover:underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
