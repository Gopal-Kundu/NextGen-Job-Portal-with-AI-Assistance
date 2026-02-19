import { USER_API_END_POINT } from "@/utils/address";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../shared/Footer";
import JobPortal from "../shared/JobPortal";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

export default function SignUp() {
  const loading = useSelector((store) => store.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Signup successful!", {
          position: "top-center",
          duration: 1000,
        });
        navigate("/login");
      }
    } catch (error) {
      toast(
        error.response?.data?.message ||
          "Something is wrong. Please try again later.",
        { position: "top-center", duration: 1000 }
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <div className="md:hidden p-5 flex justify-center">
          <Link to="/">
            <JobPortal />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
          >
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Create an Account
            </h2>

            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
              required
            />

            <input
              type="text"
              name="phonenumber"
              placeholder="Phone Number"
              value={formData.phonenumber}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
              required
            />

            <div className="mb-5 flex gap-6 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                  required
                />
                Student
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                />
                Recruiter
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 p-3 text-white font-semibold transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

        <Footer />
      </div>
    </>
  );
}
