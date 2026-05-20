import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { USER_API_END_POINT } from '@/utils/address';
import { toast } from 'sonner';
import Skeleton from '@mui/material/Skeleton';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { useReactToPrint } from 'react-to-print';
// Helper: Jake's-Resume-style section header with underline rule
const SectionRule = ({ title, fontSize = 9 }) => (
  <div style={{ marginBottom: '2px', marginTop: '6px' }}>
    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', fontSize: `${fontSize}pt`, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</div>
    <hr style={{ border: 'none', borderTop: '0.8px solid #111', margin: '2px 0 4px 0' }} />
  </div>
);

const JdResumeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showJd, setShowJd] = useState(false);
  const [showWeakSpots, setShowWeakSpots] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [baseFontSize, setBaseFontSize] = useState(8.5);
  const resumePreviewRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: resumePreviewRef,
    documentTitle: data?.companyName
      ? `${user?.fullname || 'My'}_Resume_${data.companyName}`
      : 'Tailored_Resume',
  });
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_END_POINT}/jd-resume/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPreviewAsPdf = async () => {
    if (!showResumePreview) {
      setShowResumePreview(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    handlePrint();
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleShowAtsScore = async () => {
    // 1. Check if user has existing resume or not
    if (!user || !user.profile?.resume) {
      toast.error('Please upload your resume first.');
      navigate('/resumepage');
      return;
    }

    try {
      setActionLoading(true);
      toast.info('Extracting PDF text and analyzing ATS score with Gemini...', { duration: 4000 });

      const res = await axios.post(
        `${USER_API_END_POINT}/jd-resume/${id}/analyze`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setData(res.data.data);
        toast.success('ATS score and feedback calculated successfully!');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === 'NO_RESUME') {
        toast.error('Please upload your resume first.');
        navigate('/resumepage');
      } else {
        toast.error('Failed to analyze resume. Please try again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAtsResume = async () => {
    // 1. Check if user has existing resume or not
    if (!user || !user.profile?.resume) {
      toast.error('Please upload your resume first.');
      navigate('/resumepage');
      return;
    }

    try {
      setActionLoading(true);
      toast.info('Generating tailored resume data. This may take 10-15 seconds...', { duration: 8000 });

      const res = await axios.post(
        `${USER_API_END_POINT}/jd-resume/${id}/generate`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setData(res.data.data);
        setShowResumePreview(true);
        toast.success('ATS tailored resume generated successfully!');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === 'NO_RESUME') {
        toast.error('Please upload your resume first.');
        navigate('/resumepage');
      } else {
        toast.error('Failed to generate ATS resume. Please try again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={6} />
        <Navbar />
      </div>

      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-10 flex flex-col items-center pb-24">
        {loading ? (
          <div className="max-w-4xl w-full space-y-6">
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="rectangular" width="100%" height={200} className="rounded-2xl" />
          </div>
        ) : !data ? (
          <div className="max-w-4xl w-full text-center py-20 bg-white border rounded-2xl">
            <h2 className="text-xl font-bold text-red-500">Job Description wise Resume Entry not found.</h2>
            <button onClick={() => navigate('/interviewPrep/jd-resume')} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg">
              Back to List
            </button>
          </div>
        ) : (
          <div className="max-w-4xl w-full space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    JD Wise Resume
                  </span>
                  {data.resumeLink && (
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      ATS Resume Generated
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800 mt-2">{data.companyName}</h1>
                <p className="text-gray-500 text-xs mt-1">
                  Created on {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => navigate('/interviewPrep/jd-resume')}
                className="cursor-pointer border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg transition text-sm flex items-center justify-center gap-1.5 self-start md:self-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                All Folders
              </button>
            </div>

            {/* Job Description Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <button
                onClick={() => setShowJd(!showJd)}
                className="w-full flex items-center justify-between text-left font-bold text-gray-800 focus:outline-none"
              >
                <span>Job Description Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-200 ${showJd ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${showJd ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="pt-4 border-t border-gray-100 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-xl">
                    {data.jobDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Banner if Resume is Empty */}
            {actionLoading ? (
              <div className="bg-white border border-purple-200 rounded-2xl p-10 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                </div>
                <h3 className="text-lg font-bold text-purple-700">AI Engine is processing</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Connecting to Gemini API, parsing pdf, optimizing keywords, and formatting output. Please wait...
                </p>
              </div>
            ) : (!data.initialATSScore && !data.ATSScoreOfResume) ? (
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-md text-center flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-2xl font-bold">Build or Analyze ATS Resume</h2>
                <p className="text-purple-100 mt-2 max-w-md text-sm leading-relaxed">
                  Analyze your current profile resume matching this Job Description, or create a completely tailored ATS-optimized resume compiled using LaTeX.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md justify-center">
                  <button
                    onClick={handleShowAtsScore}
                    className="cursor-pointer bg-white text-purple-700 font-bold px-5 py-3 rounded-xl hover:bg-purple-50 transition shadow w-full"
                  >
                    Show ATS Score of Resume
                  </button>
                  <button
                    onClick={handleCreateAtsResume}
                    className="cursor-pointer bg-purple-900 text-white border border-purple-800 font-bold px-5 py-3 rounded-xl hover:bg-purple-950 transition shadow w-full"
                  >
                    Create ATS Resume
                  </button>
                </div>
              </div>
            ) : (
              /* ATS Results Layout */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Current/Initial Resume Score Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-gray-500 font-bold text-xs tracking-wider uppercase mb-3">CURRENT RESUME SCORE</span>
                    {data.initialATSScore > 0 ? (
                      <div className="relative flex items-center justify-center mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="text-gray-100"
                            strokeWidth="6"
                            fill="transparent"
                            stroke="currentColor"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="text-purple-500 transition-all duration-1000"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * data.initialATSScore) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold text-gray-800">{data.initialATSScore}%</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center mb-2 py-4">
                        <span className="text-xs text-gray-400 font-medium mb-2">Not Evaluated</span>
                        <button
                          onClick={handleShowAtsScore}
                          className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold px-2.5 py-1 rounded transition"
                        >
                          Run Score
                        </button>
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">Your current profile resume match</span>
                  </div>

                  {/* Tailored Resume Score Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-gray-500 font-bold text-xs tracking-wider uppercase mb-3">TAILORED RESUME SCORE</span>
                    {data.ATSScoreOfResume > 0 ? (
                      <div className="relative flex items-center justify-center mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="text-gray-100"
                            strokeWidth="6"
                            fill="transparent"
                            stroke="currentColor"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="text-emerald-500 transition-all duration-1000"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * data.ATSScoreOfResume) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold text-gray-800">{data.ATSScoreOfResume}%</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center mb-2 py-4">
                        <span className="text-xs text-gray-400 font-medium mb-2">Not Generated</span>
                        <button
                          onClick={handleCreateAtsResume}
                          className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold px-2.5 py-1 rounded transition"
                        >
                          Create Now
                        </button>
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">Tailored ATS-optimized resume match</span>
                  </div>

                  {/* Actions & Link Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">ATS Tailored Resume Dashboard</h3>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        {data.AtsResumeJson
                          ? "Your tailored resume data has been generated. Use the preview to save as PDF."
                          : "Generate an ATS tailored resume based on the job description by clicking Create ATS Resume."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 mt-4">


                      <button
                        onClick={handleCreateAtsResume}
                        className="cursor-pointer bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-3.5 py-2 rounded-xl transition text-xs flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        {data.AtsResumeJson ? "Recreate ATS Resume" : "Create ATS Resume"}
                      </button>

                      <button
                        onClick={handleShowAtsScore}
                        className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-3.5 py-2 rounded-xl transition text-xs"
                      >
                        Re-run Initial Score
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback and Weakspots (Full Width Top) */}
                <div className="w-full">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <button
                      onClick={() => setShowWeakSpots(!showWeakSpots)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-2 text-rose-600 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Weak Spots In Resume</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showWeakSpots ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${showWeakSpots ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="text-gray-600 text-sm leading-relaxed flex-1 pt-4 border-t border-gray-100">
                          <ReactMarkdown
                            components={{
                              h3: ({ node, ...props }) => <h3 className="text-md font-bold text-gray-800 mt-4 mb-2" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5" {...props} />,
                              li: ({ node, ...props }) => <li className="text-gray-600" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-semibold text-gray-800" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            }}
                          >
                            {data.WeakSpotInResume || "No major weak spots found!"}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YouTube Searches & Courses */}
                <div className="w-full">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <button
                      onClick={() => setShowCourses(!showCourses)}
                      className="w-full flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-2 text-purple-600 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Recommended Searches & Courses</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showCourses ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${showCourses ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="text-gray-600 text-sm leading-relaxed flex-1 pt-4 border-t border-purple-100">
                          <ReactMarkdown
                            components={{
                              h3: ({ node, ...props }) => <h3 className="text-md font-bold text-purple-700 mt-4 mb-2 border-b border-purple-100 pb-1" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 marker:text-purple-500" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 marker:text-purple-600 marker:font-semibold" {...props} />,
                              li: ({ node, ...props }) => <li className="text-gray-700 leading-relaxed" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                              em: ({ node, ...props }) => <em className="text-gray-500 not-italic block mt-0.5 text-xs" {...props} />
                            }}
                          >
                            {data.recomendedYoutubeSearchesAndCourses || "No specific learning paths recommended."}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rendered Resume Preview */}
                {data.AtsResumeJson && (() => {
                  let resumeData = null;
                  try { resumeData = JSON.parse(data.AtsResumeJson); } catch (e) { }
                  if (!resumeData) return null;
                  const c = resumeData.contact || {};
                  const contactParts = [c.phone, c.email, c.linkedin, c.github, c.portfolio].filter(Boolean);
                  return (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <div className="w-full flex items-center justify-between">
                        <button
                          onClick={() => setShowResumePreview(!showResumePreview)}
                          className="flex items-center gap-2 text-left font-bold text-gray-800 focus:outline-none"
                        >
                          <span>New Resume</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${showResumePreview ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {data.AtsResumeJson && (
                          <div className="flex items-center gap-3">
                            {/* Dynamic Font Size Control Panel */}
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg text-[10px] sm:text-xs">
                              <span className="text-gray-500 font-medium select-none">Font Size:</span>
                              <button
                                onClick={() => setBaseFontSize(prev => Math.max(7.0, +(prev - 0.5).toFixed(1)))}
                                className="w-5 h-5 flex items-center justify-center bg-white border border-gray-200 rounded font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-90 transition select-none cursor-pointer"
                                title="Decrease font size"
                              >
                                -
                              </button>
                              <span className="font-bold text-gray-800 w-9 text-center select-none">{baseFontSize}pt</span>
                              <button
                                onClick={() => setBaseFontSize(prev => Math.min(12.0, +(prev + 0.5).toFixed(1)))}
                                className="w-5 h-5 flex items-center justify-center bg-white border border-gray-200 rounded font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-90 transition select-none cursor-pointer"
                                title="Increase font size"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => downloadPreviewAsPdf()}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs flex items-center gap-1.5 shadow cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>

                      <div
                        className={`grid transition-all duration-300 ease-in-out ${showResumePreview ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                      >
                        <div className="overflow-hidden">
                          <div className="pt-4 border-t border-gray-100 overflow-x-auto">
                            {/* Resume Paper */}
                            <div ref={resumePreviewRef} className="border border-gray-200 shadow-md print:border-none print:shadow-none" style={{
                              fontFamily: 'Lora, Georgia, serif', fontSize: `${baseFontSize}pt`, lineHeight: 1.25, color: '#111', background: '#fff', padding: '36px 48px', width: '210mm',
                              minHeight: '297mm', boxSizing: 'border-box'
                            }}>

                              {/* Name */}
                              <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                                <span style={{ fontSize: `${baseFontSize * 2.1}pt`, fontWeight: 'bold', fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{resumeData.name}</span>
                              </div>

                              {/* Contact */}
                              {contactParts.length > 0 && (
                                <div style={{ textAlign: 'center', fontSize: `${baseFontSize - 0.5}pt`, fontFamily: 'Inter, sans-serif', color: '#444', marginBottom: '8px' }}>
                                  {contactParts.join('  |  ')}
                                </div>
                              )}

                              {/* Summary */}
                              {resumeData.summary && (
                                <>
                                  <SectionRule title="Summary" fontSize={baseFontSize + 0.5} />
                                  <p style={{ fontSize: `${baseFontSize}pt`, marginBottom: '6px', textAlign: 'justify' }}>{resumeData.summary}</p>
                                </>
                              )}

                              {/* Skills */}
                              {resumeData.skills?.length > 0 && (
                                <>
                                  <SectionRule title="Technical Skills" fontSize={baseFontSize + 0.5} />
                                  <div style={{ marginBottom: '6px' }}>
                                    {resumeData.skills.map((s, i) => (
                                      <div key={i} style={{ fontSize: `${baseFontSize}pt`, marginBottom: '2px' }}>
                                        <strong>{s.category}:</strong> {s.items}
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {/* Experience */}
                              {resumeData.experience?.length > 0 && (
                                <>
                                  <SectionRule title="Experience" fontSize={baseFontSize + 0.5} />
                                  {resumeData.experience.map((exp, i) => (
                                    <div key={i} style={{ marginBottom: '6px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: `${baseFontSize}pt` }}>
                                        <span>{exp.company}</span><span style={{ fontWeight: 'normal', fontSize: `${baseFontSize - 0.5}pt` }}>{exp.dates}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: `${baseFontSize - 0.5}pt`, marginBottom: '2px' }}>
                                        <span>{exp.role}</span><span>{exp.location}</span>
                                      </div>
                                      {exp.bullets?.map((b, j) => <div key={j} style={{ fontSize: `${baseFontSize - 0.5}pt`, paddingLeft: '12px' }}>• {b}</div>)}
                                    </div>
                                  ))}
                                </>
                              )}

                              {/* Projects */}
                              {resumeData.projects?.length > 0 && (
                                <>
                                  <SectionRule title="Projects" fontSize={baseFontSize + 0.5} />
                                  {resumeData.projects.map((proj, i) => (
                                    <div key={i} style={{ marginBottom: '6px' }}>
                                      <div style={{ fontWeight: 'bold', fontSize: `${baseFontSize}pt`, marginBottom: '1px' }}>
                                        {proj.name} <span style={{ fontWeight: 'normal', fontSize: `${baseFontSize - 0.5}pt` }}>— {proj.technologies}</span>
                                      </div>
                                      {proj.bullets?.map((b, j) => <div key={j} style={{ fontSize: `${baseFontSize - 0.5}pt`, paddingLeft: '12px' }}>• {b}</div>)}
                                    </div>
                                  ))}
                                </>
                              )}

                              {/* Achievements */}
                              {resumeData.achievements?.length > 0 && (
                                <>
                                  <SectionRule title="Achievements" fontSize={baseFontSize + 0.5} />
                                  <div style={{ marginBottom: '6px' }}>
                                    {resumeData.achievements.map((a, i) => <div key={i} style={{ fontSize: `${baseFontSize - 0.5}pt`, paddingLeft: '12px' }}>• {a}</div>)}
                                  </div>
                                </>
                              )}

                              {/* Education */}
                              {resumeData.education?.length > 0 && (
                                <>
                                  <SectionRule title="Education" fontSize={baseFontSize + 0.5} />
                                  {resumeData.education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: '4px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: `${baseFontSize}pt` }}>
                                        <span>{edu.institution}</span><span style={{ fontWeight: 'normal', fontSize: `${baseFontSize - 0.5}pt` }}>{edu.dates}</span>
                                      </div>
                                      <div style={{ fontStyle: 'italic', fontSize: `${baseFontSize - 0.5}pt` }}>{edu.degree} | {edu.location}</div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
      <Footer />
    </>
  );
};

export default JdResumeDetail;
