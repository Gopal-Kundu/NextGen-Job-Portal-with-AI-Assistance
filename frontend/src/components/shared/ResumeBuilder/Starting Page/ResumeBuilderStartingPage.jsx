import React from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import resumePic from "../../../../assets/resumebuilder-staringpage-pic.png";
import Footer from "../../Footer";

function ResumeBuilderStartingPage() {
  return (
    <div className="w-full min-h-screen text-gray-900" style={{ backgroundColor: "rgb(240, 240, 242)" }}>
      {/* Navbar + Sidebar */}
      <div className="relative flex items-start">
        <Sidebar highlightIndex={5} />
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Section */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Welcome to  
              <br />
              <span className="text-purple-900">AI Resume Maker</span>
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Craft professional resumes effortlessly with artificial intelligence.
              Get noticed and land your dream job faster.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="cursor-pointer flex items-center justify-center px-8 py-3 rounded-lg shadow-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create New Resume
              </button>

              <button className="cursor-pointer flex items-center justify-center px-8 py-3 rounded-lg border border-purple-300 bg-white text-purple-600 font-medium hover:bg-purple-50 transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4L8 8m4-4v12" />
                </svg>
                Load Existing
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex justify-center lg:justify-end">
            <img 
              src={resumePic} 
              alt="Resume Builder Illustration"
              className="w-full max-w-md lg:max-w-xl drop-shadow-xl rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default ResumeBuilderStartingPage;
