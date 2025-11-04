import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/address";
import { setLoading, setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { setJobs } from "@/redux/jobSlice";

export default function AddJobBtn({ hide }) {
  const jobs = useSelector((store) => store.job.jobs);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    title: "",
    description: "",
    salary: 0,
    location: "",
    requirements: "",
    experience: 0,
    jobType: "Full-time",
    vacancy: 1,
    company: "Tcs",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    hide();
    dispatch(setLoading(true));
    const formData = { ...data };

    try {
      const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job Posted Successfully", {
          position: "top-center",
          duration: 2000,
        });
      }

      dispatch(setJobs([...jobs, res.data.job]));
      dispatch(setUser(res.data.user));
    } catch (error) {
      console.error("Axios error:", error);
      toast.error("Server Error", {
        position: "top-center",
      });
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-50 font-sans w-full max-w-4xl mx-auto shadow-lg overflow-y-auto max-h-[90vh]">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add a new Job
          </h2>
          <button
            className="bg-blue-500 px-4 py-2 text-white rounded-xl cursor-pointer active:scale-90 transition-transform duration-200"
            onClick={hide}
          >
            Close
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
        >
          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">Job Title</span>
            <input
              type="text"
              name="title"
              placeholder="Eg: Frontend Developer"
              value={data.title}
              onChange={handleChange}
              className="form-input p-3 border rounded-md focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">Salary</span>
            <input
              type="number"
              name="salary"
              placeholder="Eg: 50000"
              value={data.salary}
              onChange={handleChange}
              className="form-input p-3 border rounded-md focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">Location</span>
            <input
              type="text"
              name="location"
              placeholder="Eg: West Bengal"
              value={data.location}
              onChange={handleChange}
              className="form-input p-3 border rounded-md focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">Company Name</span>
            <select
              name="company"
              value={data.company}
              onChange={handleChange}
              className="form-select p-3 border rounded-md focus:ring-blue-500"
            >
              {user?.createdCompanies?.length === 0 ? (
                <option disabled>You must create a company</option>
              ) : (
                user?.createdCompanies?.map((company, idx) => (
                  <option key={idx} value={company?.name}>
                    {company?.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">
              Experience (Years)
            </span>
            <input
              type="number"
              name="experience"
              placeholder="2"
              value={data.experience}
              onChange={handleChange}
              className="form-input p-3 border rounded-md focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">Job Type</span>
            <select
              name="jobType"
              value={data.jobType}
              onChange={handleChange}
              className="form-select p-3 border rounded-md focus:ring-blue-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium mb-1">Vacancy</span>
            <input
              type="number"
              name="vacancy"
              placeholder="3"
              value={data.vacancy}
              onChange={handleChange}
              className="form-input p-3 border rounded-md focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col md:col-span-2">
            <span className="text-gray-700 font-medium mb-1">
              Job Description
            </span>
            <textarea
              name="description"
              placeholder="Full job description..."
              rows="4"
              value={data.description}
              onChange={handleChange}
              className="form-textarea p-3 border rounded-md focus:ring-blue-500 resize-none"
            ></textarea>
          </label>

          <label className="flex flex-col md:col-span-2">
            <span className="text-gray-700 font-medium mb-1">Requirements</span>
            <textarea
              name="requirements"
              placeholder="Required skills, qualifications..."
              rows="4"
              value={data.requirements}
              onChange={handleChange}
              className="form-textarea p-3 border rounded-md focus:ring-blue-500 resize-none"
            ></textarea>
          </label>

          {/* Actions */}
          <div className="flex md:col-span-2 justify-end gap-5">
            <button
              type="button"
              onClick={hide}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 active:scale-90 cursor-pointer transition-transform duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 active:scale-90 cursor-pointer transition-transform duration-200"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
