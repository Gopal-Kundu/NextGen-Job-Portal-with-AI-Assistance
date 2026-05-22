import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { USER_API_END_POINT } from '@/utils/address';
import { toast } from 'sonner';
import Skeleton from '@mui/material/Skeleton';

const JdResumeList = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  
  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_END_POINT}/jd-resume/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job description entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !jobDescription.trim()) {
      toast.error('Please provide both company name and job description.');
      return;
    }

    try {
      setCreating(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/jd-resume/create`,
        { companyName, jobDescription },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success('Job description entry created successfully!');
        setResumes((prev) => [res.data.data, ...prev]);
        setCompanyName('');
        setJobDescription('');
        setOpenModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create entry.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this folder?')) return;
    
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/jd-resume/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success('Folder deleted.');
        setResumes((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete.');
    }
  };

  return (
    <>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={6} />
        <Navbar />
      </div>

      <div className="relative min-h-screen bg-gray-50 p-6 md:p-10 font-sans flex flex-col items-center pb-24">
        <div className="max-w-6xl w-full flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create ATS Resumes</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and create tailored resumes for specific job descriptions or get score of current resume.</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Resume
          </button>
        </div>

        {loading ? (
          <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <Skeleton variant="rectangular" width="40%" height={16} className="mb-4 rounded" />
                <Skeleton variant="text" width="80%" height={24} className="mb-2" />
                <Skeleton variant="text" width="60%" height={16} />
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] w-full text-center">
            <div className="bg-purple-50 p-6 rounded-full text-purple-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Create New Resume </h2>
            <p className="text-gray-400 mt-2 max-w-sm">Create a new folder using a Job Description and Company Name to build an ATS tailored resume.</p>
            <button
              onClick={() => setOpenModal(true)}
              className="cursor-pointer mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              Add First Folder
            </button>
          </div>
        ) : (
          <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/interviewPrep/jd-resume/${resume._id}`)}
                className="group relative cursor-pointer flex flex-col items-stretch transition-transform hover:-translate-y-1 select-none"
              >
                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, resume._id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition z-20 opacity-0 group-hover:opacity-100 duration-200"
                  title="Delete Folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Folder Top Tab */}
                <div className="w-20 h-4 bg-yellow-500 rounded-t-lg shadow-sm border-t border-x border-yellow-400 group-hover:bg-yellow-400 transition-colors"></div>
                
                {/* Folder Main Body */}
                <div className="bg-yellow-400 rounded-r-xl rounded-bl-xl p-5 shadow-md border border-yellow-300 flex flex-col justify-between h-40 group-hover:bg-yellow-300 transition-colors relative overflow-hidden">
                  {/* Diagonal background line effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12"></div>
                  
                  <div className="z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-800/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="font-bold text-lg text-yellow-900 line-clamp-1">{resume.companyName}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between text-yellow-800 text-xs font-semibold z-10">
                    <span>ATS: {resume.initialATSScore ? `${resume.initialATSScore}%` : 'N/A'}</span>
                    <span className="bg-yellow-950/15 px-2 py-0.5 rounded text-[10px]">
                      {resume.AtsResumeJson ? 'Tailored' : 'Initial'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Create Folder</h3>
              <button
                onClick={() => setOpenModal(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <p className="text-gray-500 text-sm">Please provide the Job Description and the Company Name to start.</p>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Netflix, Meta, TCS"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description</label>
                <textarea
                  placeholder="Paste the full job description text here..."
                  rows="6"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none font-sans"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition disabled:opacity-75"
                >
                  {creating ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default JdResumeList;
