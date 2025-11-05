import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import JobCard from "./Jobcard";
import { useSelector } from "react-redux";

export default function Jobs() {
  const jobs = useSelector((state) => state.job.jobs);
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="h-full flex items-center">
          <Sidebar highlightIndex={2} className="bg-gray-500" />
          <Navbar />
        </div>
        <div className="mt-10 ml-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {jobs?.length === 0 ? (
              "No Jobs available"
            ) : (
              <>
                <span className="text-purple-700">All</span> Job Openings
              </>
            )}
          </h3>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {jobs?.map((job, idx) => (
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
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
