import Footer from "./Footer";
import Navbar from "./Navbar";
import JobsListing from "./JobsListing";
import Sidebar from "./Sidebar";
import FilterBtn from './FilterBtn';

export default function Jobs() {

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="h-full relative flex items-center">
              <Sidebar highlightIndex={2} className="bg-gray-500" />
              <Navbar />
            </div>
        <h3 className="text-3xl font-bold text-gray-800 mt-10 ml-8">
          <span className="text-purple-700">All</span> Job Openings
        </h3>
        <div className="float-right mr-55 mt-2"><FilterBtn/></div>
        <JobsListing showJobs={6} smallDevice={"block"} />
      </div>
              <Footer />
    </>
  );
}
