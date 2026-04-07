import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DashBoardForm from '../ui/DashBoardForm';
import { USER_API_END_POINT } from '@/utils/address';

const Dashboard = () => {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchInterviewPrep = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await axios.get(`${USER_API_END_POINT}/get-interviewPrep`, {
        withCredentials: true,
      });

      setProfiles(res.data.data);
      setLoading(false);

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchInterviewPrep();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.post(
        `${USER_API_END_POINT}/deleteInterviewPrep`,
        { dashboardId: selectedId },
        { withCredentials: true }
      );

      setProfiles((prev) => prev.filter((item) => item._id !== selectedId));
      setShowConfirm(false);
      setSelectedId(null);

    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };

  const colors = [
    "bg-teal-50",
    "bg-yellow-50",
    "bg-blue-50",
    "bg-orange-50",
    "bg-sky-50",
    "bg-gray-100",
    "bg-pink-50",
    "bg-green-50",
    "bg-purple-50"
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={6} />
        <Navbar />
      </div>

      <div className="relative min-h-screen bg-gray-50 p-6 md:p-10 font-sans">

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error || profiles.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-400 text-center">
              Click add new to start preparing.
            </h1>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {profiles.map((profile, index) => (
              <div 
                key={index} 
                onClick={() => navigate(`/interviewPrep/dashboard/${profile._id}`, { state: profile })}
                className="group relative cursor-pointer bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
              >

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(profile._id);
                    setShowConfirm(true);
                  }}
                  className="absolute top-3 cursor-pointer right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white p-2 rounded-full shadow hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8zm3-3a1 1 0 011 1v1H5V6a1 1 0 011-1h3V4a1 1 0 112 0v1h3zM4 7h12l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className={`p-4 rounded-xl flex items-start gap-4 ${getRandomColor()}`}>
                  <div className="bg-white h-12 w-12 rounded-lg flex items-center justify-center font-bold text-gray-800 shadow-sm shrink-0">
                    {profile.Title?.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.Title}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-snug">{profile.skills}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-5 mb-4">
                  <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 whitespace-nowrap">
                    Experience: {profile.YearsOfExperience}
                  </span>
                  <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 whitespace-nowrap">
                    {profile.QuestionsWithAnswer?.length || 0} Q&A
                  </span>
                  <span className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 whitespace-nowrap">
                    Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-auto pt-2">
                  <p className="text-sm text-gray-500">{profile.description}</p>
                </div>
              </div>
            ))}

          </div>
        )}

        <button 
          onClick={()=>setOpenForm(true)} 
          className="fixed bottom-10 right-10 bg-orange-400 hover:bg-orange-500 text-white flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-lg transition-colors duration-200 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </button>

      </div>

      {openForm ? (
        <DashBoardForm 
          onClose={() => {
            setOpenForm(false);
            fetchInterviewPrep();
          }} 
        />
      ) : null}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure want to delete?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;