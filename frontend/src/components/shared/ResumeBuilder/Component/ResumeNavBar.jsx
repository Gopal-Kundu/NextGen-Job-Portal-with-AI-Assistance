import React from "react";
import JobPortal from "../../JobPortal";

function ResumeNavBar({ flag1 = false, flag2 = false, flag3 = false }) {
  const Step = ({ number, text, isActive }) => (
    <div className="flex items-center space-x-2">
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-sm font-bold 
                            ${isActive ? "bg-purple-500" : "bg-gray-300"}`}
      >
        {number}
      </div>
      <span
        className={`text-sm ${
          isActive ? "text-gray-900 font-semibold" : "text-gray-500"
        }`}
      >
        {text}
      </span>
    </div>
  );
  return (
    <div>
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b-0">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <JobPortal />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center space-x-2">
            <Step number={1} text="Choose template" isActive={flag1} />
            <div className="w-8 h-px bg-gray-300"></div>
            <Step number={2} text="Enter your details" isActive={flag2} />
            <div className="w-8 h-px bg-gray-300"></div>
            <Step number={3} text="Download resume" isActive={flag3} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default ResumeNavBar;
