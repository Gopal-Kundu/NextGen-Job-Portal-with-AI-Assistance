import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

function ResumeBuilder() {
  return (
    <div>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={5} className="bg-gray-500" />
        <Navbar /> 
      </div>
    </div>
  );
}
 
export default ResumeBuilder;
