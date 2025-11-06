import Footer from "./Footer";
import Navbar from "./Navbar";
import JobsListing from "./JobsListing";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Homepage() {
  const navigate = useNavigate();
  function search(query){
    if (query.trim() !== "")
    navigate(`/search?query=${query}`);
  }
  const [value, setValue] = useState();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") search(value);
  };
  return (
    <>
        <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={1} className="bg-gray-500"/><Navbar/>
      </div>
       
        <div className="min-h-[800px] h-full bg-gray-50 p-4 select-none md:select-auto w-full">
          <main className="mt-8 text-center">
            <span className="inline-block bg-red-100 text-red-500 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              No. 1 Job Hunt Website
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Search, Apply
              <br />
              Get Your <span className="text-purple-700">Dream Jobs</span>
            </h2>
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative ">
                <input
                  id="job-search"
                  onChange={(e)=>setValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  name="jobSearch"
                  className="w-full h-16 p-5 rounded-full text-xl md:text-3xl text-gray-700 focus:outline-none focus:border-indigo-500 border border-black"
                  placeholder="Find your dream jobs"
                  type="text"
                />

                <button onClick={()=>search(value)} className="active:scale-90 absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700">
                  <span className="inline-block material-icons scale-140 transition-transform duration-200 cursor-pointer">
                    search
                  </span>
                </button>
              </div>
            </div>

          </main>

          {/* Job Openings */}
          <h3 className="text-3xl font-bold text-gray-800 mt-10">
            <span className="text-purple-700">Latest and Top</span> Job Openings
          </h3>
          <JobsListing showJobs={3} smallDevice={"hidden md:block"} />
        </div>
          <Footer/>
    </>
  );
}
