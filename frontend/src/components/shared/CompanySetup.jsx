import { setLoading, setUser } from "@/redux/authSlice";
import { COMPANY_API_END_POINT } from "@/utils/address";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function CompanySetup({ cancel }) {
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    cancel();
    try {
      dispatch(setLoading(true));
      const data = new FormData();
      data.append("companyName", formData.companyName);
      data.append("description", formData.description);
      data.append("website", formData.website);
      data.append("location", formData.location);
      data.append("logo", formData.logo);
      setFormData({
        companyName: "",
        description: "",
        website: "",
        location: "",
        logo: "",
      });
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if(res.data.success){
        toast.success("Company added Successfully",{
          position: "top-end",
          duration: 2000,
        })
      }
      dispatch(setUser(res.data.user));
    } catch (err) {
      toast.error("Something is wrong",{
          position: "top-end",
          duration: 2000,
        })
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-white/30 bg-opacity-30 backdrop-blur-sm">
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Company Setup
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid sd:grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="resize-none w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Logo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Logo</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center gap-5">
            <button
              type="submit"
              className="w-full bg-blue-800 text-white p-2 rounded-md hover:bg-blue-900 transition-colors"
            >
              Create Company
            </button>
            <button
              type="button"
              onClick={cancel}
              className="w-full cursor-pointer bg-blue-800 text-white p-2 rounded-md hover:bg-blue-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
