import React, { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/address";

const DashBoardForm = ({ onClose, normalClose }) => {
  const [formData, setFormData] = useState({
    targetRole: "Software Engineer",
    experience: "",
    topics: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/create-interviewprep`,
        {
          title: formData.targetRole,
          yearsofexperience: formData.experience,
          skills: formData.topics,
          description: formData.description,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Success:", res.data);

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">

        <button
          onClick={normalClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Start a New Interview Journey</h2>
            <p className="text-sm text-gray-500">
              Fill out a few quick details and unlock your personalized set of interview questions!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="targetRole" className="block text-sm text-gray-700 mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm text-gray-700 mb-1.5">
                Years of Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                placeholder="(e.g., 1 year, 3 years, 5+ years)"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-lg placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="topics" className="block text-sm text-gray-700 mb-1.5">
                Topics to Focus On
              </label>
              <input
                type="text"
                id="topics"
                name="topics"
                placeholder="(e.g., React, Node.js, MongoDB)"
                value={formData.topics}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-lg placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                placeholder="(Any specific goals for this position)"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-lg placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default DashBoardForm;