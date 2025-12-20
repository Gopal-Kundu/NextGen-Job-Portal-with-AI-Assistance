import React from "react";
import ResumeNavBar from "../Component/ResumeNavBar";
import Resume1 from "../Resume Pages/Resume1";
import template1 from "../../../../assets/template-1.png";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTemplateSrc } from "@/redux/resumeSlice";
export const ChooseTemplatePage = () => {
  const dispatch = useDispatch();
  const url = "/resumemaker/choose-template/resume-template";
  return (
    <div>
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

<div className="flex justify-center items-center px-4">
  <div
    className="
      flex gap-4
      overflow-x-auto
      md:overflow-visible
      md:flex-wrap
      p-4
      rounded-lg
      max-w-full
      justify-center
      flex-col
      md:flex-row
      items-center
    "
  >
      <Link to={"/resumemaker/fill-details"}><img
        src={template1}
        alt="template-1"
        onClick={dispatch(setTemplateSrc(`${url}-1`))}   //Set link later
        className="
          cursor-pointer
          h-60
          object-contain
          shrink-0
          hover:scale-105
          transition
        "
      /></Link>
  </div>
</div>

        </main>
      </div>
      <Footer />
    </div>
  );
};
