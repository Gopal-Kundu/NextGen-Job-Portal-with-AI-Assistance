import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReactMarkdown from "react-markdown";
import { USER_API_END_POINT } from '@/utils/address';

const Icons = {
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6" /></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
};

const InterviewQAPage = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);
  const [expandedId, setExpandedId] = useState(null);
  const [learningMoreId, setLearningMoreId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const toggleAccordion = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const closeDrawer = () => {
    setLearningMoreId(null);
  };

  const handleLoadMore = async () => {
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

      setLoadingMore(false);
    } catch (error) {
      console.error("Load More Error:", error.response?.data || error.message);
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

      <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden p-6 md:p-12 flex flex-col">

        <div className="max-w-[1400px] mx-auto mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            {data?.Title}
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            {data?.skills}
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
              Experience: {data?.YearsOfExperience}
            </span>
            <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
              {data?.QuestionsWithAnswer?.length || 0} Q&A
            </span>
            <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
              Last Updated: {new Date(data?.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto flex gap-10 items-start">

          <div className={`transition-all duration-300 ${learningMoreId !== null ? 'w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
            <h2 className="text-xl font-semibold mb-6">Interview Q & A</h2>

            <div className="flex flex-col gap-3 pb-10">
              {data?.QuestionsWithAnswer?.map((item, index) => {
                const isExpanded = expandedId === index;

                return (
                  <div
                    key={index}
                    className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'shadow-sm bg-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div
                      onClick={() => toggleAccordion(index)}
                      className="flex items-center justify-between p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-7 flex-1">
                        <span className="text-gray-400 font-medium w-4 text-center">Q{index+1} </span>
                        <span className="font-medium text-[15px]"> {item.Qs}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">
                          {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 px-6 bg-gray-50 border-t text-sm text-gray-700 whitespace-pre-wrap">
                        <ReactMarkdown>
                          {item.Ans}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pb-20">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2.5 font-medium hover:bg-gray-800 transition-colors shadow-sm disabled: cursor-pointer"
              >
                {loadingMore ? "Generating..." : "Load More"}
              </button>
            </div>

          </div>

          {learningMoreId !== null && (
            <div className="w-1/2 bg-gray-50 p-6 rounded-xl shadow-md relative">
              <button
                onClick={closeDrawer}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <Icons.Close />
              </button>

              <h2 className="text-lg font-semibold mb-4">Detailed Answer</h2>

              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {activeDetailData?.Ans}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default InterviewQAPage;