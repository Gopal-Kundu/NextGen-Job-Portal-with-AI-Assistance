import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReactMarkdown from "react-markdown";
import { USER_API_END_POINT } from '@/utils/address';
import Skeleton from "@mui/material/Skeleton";

const Icons = {
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
};

const InterviewQAPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [learningMoreId, setLearningMoreId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchQnAData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/get-interviewPrep`, {
          withCredentials: true,
        });
        
        const allProfiles = res.data.data;
        const currentProfile = allProfiles.find(item => item._id === id);
        
        setData(currentProfile);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQnAData();
    }
  }, [id]);

  const toggleAccordion = (index) => {
    setExpandedId(prev => prev === index ? null : index);
  };

  const closeDrawer = () => {
    setLearningMoreId(null);
  };

  const handleLoadMore = async () => {
    if (!data) return;
    try {
      setLoadingMore(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/generate-more-questions`,
        { dashboardId: data._id },
        { withCredentials: true }
      );

      const newQs = res.data.data;

      setData(prev => ({
        ...prev,
        QuestionsWithAnswer: [...prev.QuestionsWithAnswer, ...newQs]
      }));

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const activeDetailData = data?.QuestionsWithAnswer?.find(
    (q, index) => index === learningMoreId
  );

  return (
    <>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={6} />
        <Navbar />
      </div>

      <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden p-6 md:p-12 flex flex-col items-center">

        <div className="max-w-4xl mx-auto mb-10 w-full flex flex-col items-center text-center">
          {loading ? (
            <>
              <Skeleton variant="text" width="60%" height={50} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <Skeleton variant="rounded" width={130} height={32} sx={{ borderRadius: '9999px' }} />
                <Skeleton variant="rounded" width={90} height={32} sx={{ borderRadius: '9999px' }} />
                <Skeleton variant="rounded" width={160} height={32} sx={{ borderRadius: '9999px' }} />
              </div>
            </>
          ) : data ? (
            <>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                {data.Title}
              </h1>
              <p className="text-gray-600 mb-6 text-sm max-w-2xl">
                {data.skills}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  Experience: {data.YearsOfExperience}
                </span>
                <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  {data.QuestionsWithAnswer?.length || 0} Q&A
                </span>
                <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  Last Updated: {new Date(data.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </>
          ) : (
            <h1 className="text-2xl font-semibold text-red-500">Interview prep not found.</h1>
          )}
        </div>

        <div className="w-full max-w-[1400px] flex justify-center gap-10 items-start">

          <div className={`transition-all duration-300 ${learningMoreId !== null ? 'w-1/2 hidden md:flex flex-col items-center' : 'w-full max-w-4xl flex flex-col items-center'}`}>
            <h2 className="text-xl font-semibold mb-6 text-center">
              {loading ? <Skeleton width={150} /> : "Interview Q & A"}
            </h2>

            <div className="flex flex-col gap-3 pb-10 w-full text-left">
              {loading ? (
                [1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="border border-gray-100 rounded-xl bg-white p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 w-full">
                      <Skeleton variant="text" width={30} height={24} />
                      <Skeleton variant="text" width="70%" height={24} />
                    </div>
                    <Skeleton variant="circular" width={24} height={24} />
                  </div>
                ))
              ) : (
                data?.QuestionsWithAnswer?.map((item, index) => {
                  const isExpanded = expandedId === index;

                  return (
                    <div
                      key={index}
                      className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-md bg-white border-gray-200' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <div
                        onClick={() => toggleAccordion(index)}
                        className="flex items-center justify-between p-4 md:p-5 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 md:gap-7 flex-1">
                          <span className="text-gray-400 font-medium w-6 text-center shrink-0">Q{index + 1}</span>
                          <span className="font-medium text-[15px] pr-4">{item.Qs}</span>
                        </div>

                        <div className={`flex items-center gap-3 text-gray-400 transition-transform duration-300 ease-in-out shrink-0 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          <Icons.ChevronDown />
                        </div>
                      </div>

                      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="p-5 px-6 md:px-16 bg-gray-50 border-t text-sm text-gray-700 whitespace-pre-wrap">
                            <ReactMarkdown>
                              {item.Ans}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {!loading && data && (
              <div className="flex justify-center pb-20 w-full">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2.5 font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Generating..." : "Load More"}
                </button>
              </div>
            )}
          </div>

          {learningMoreId !== null && data && (
            <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-xl shadow-md relative mt-12 md:mt-0 text-left">
              <button
                onClick={closeDrawer}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1"
              >
                <Icons.Close />
              </button>

              <h2 className="text-lg font-semibold mb-4 pr-6 text-gray-900">Detailed Answer</h2>

              <div className="text-sm text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none">
                <ReactMarkdown>
                  {activeDetailData?.Ans || ""}
                </ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default InterviewQAPage;