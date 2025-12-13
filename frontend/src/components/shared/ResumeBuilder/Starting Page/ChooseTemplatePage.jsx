import React from "react";
import ResumeNavBar from "../Component/ResumeNavBar";
import Resume1 from "../Resume Pages/Resume1";
import template1 from "../../../../assets/template-1.png";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
export const ChooseTemplatePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navigation Bar */}
      <div className="hidden md:block">
        <ResumeNavBar flag1="true" />
      </div>
      <div className="md:hidden sm:block h-full relative flex items-center">
        <Sidebar highlightIndex={5} />
        <Navbar />
      </div>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 text-center">
        {/* Heading */}
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-800 mb-6 leading-tight">
          Choose a Resume Template
        </h1>
        {/* choose template  */}
        <div className="w-full h-[50vh] border border-black flex items-center">
          <img className="h-[40vh] cursor-pointer" src={template1} />
        </div>
      </main>
      <Footer/>
    </div>
  );
};
