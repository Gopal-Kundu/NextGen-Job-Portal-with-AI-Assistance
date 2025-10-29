import { USER_API_END_POINT } from "@/utils/address";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../shared/Footer";
import Jobhunt from "../shared/Jobhunt";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import LoadingOverlay from "../ui/LoadingOverlay";

export default function SignUp() {
  const loading = useSelector((store)=>store.auth.loading);
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

        navigate("/login"); // redirect to login page
      }
    } catch (error) {

      toast(
        error.response.data.message ||
          "Something is wrong. Please try again later.",
        { position: "top-center", duration: 1000 }
      );
    }finally{
      setTimeout(()=>{
              dispatch(setLoading(false));
      },2000);
    }
  };

  return (
    <>
      <div className="relative min-h-screen min-w-screen">
        {loading ? <LoadingOverlay message="Signing Up..."/> : null}
        <div className="md:hidden p-5 flex justify-center select-none md:select-auto ">
          <Link to="/"><Jobhunt /></Link>
        </div>
        <div className="flex items-center justify-center bg-gray-50 select-none md:select-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <h2 className="mb-6 text-left text-2xl font-bold">Sign Up</h2>

            {/* Full Name */}
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="mb-3 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mb-3 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Phone */}
            <input
              type="text"
              name="phonenumber"
              placeholder="Phone Number"
              value={formData.phonenumber}
              onChange={handleChange}
              className="mb-3 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Password */}
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="mb-3 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Role */}
            <div className="mb-3 flex items-center gap-4">
              <label className="flex items-center gap-1">
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
              <label className="flex items-center gap-1">
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

            {/* Submit Button */}
            <div className="hover:scale-105 transition-transform duration-100">
              <button
                type="submit"
                className="cursor-pointer  w-full rounded-lg bg-black p-3 text-white hover:bg-gray-800"
              >
                Sign Up
              </button>
            </div>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div></div>
      <Footer />
    </>
  );
}
