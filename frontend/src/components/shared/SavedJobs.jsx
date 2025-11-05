import JobCard from "./Jobcard";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";

export default function SavedJobs() {
  const jobs = useSelector((store) => store.auth.user);
  return (
    <>
      <div className="min-h-screen">
        <div className="h-full relative flex items-center">
          <Sidebar highlightIndex={4} className="bg-gray-500" />
          <Navbar />
        </div>
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">{jobs?.savedJobs?.length==0 ? "No Saved Jobs":"Saved Jobs"}</h1>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {jobs?.savedJobs?.map((job, idx) => (
                  <JobCard
                    key={idx}
                  jobType={job.jobType}
                  salary={job.salary}
                  vacancy={job.vacancy}
                  description={job.description}
                  location={job.location}
                  companyName={job.company}
                  role={job.role}
                  datePosted={job.createdAt}
                  id={job._id}
                  />
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
