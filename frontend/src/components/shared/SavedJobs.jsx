import JobCard from "./Jobcard";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";

export default function SavedJobs() {
  const user = useSelector((store) => store.auth.user);
  const loading = useSelector((store) => store.auth.loading);

  return (
    <>
      <div className="min-h-screen">
        <div className="h-full relative flex items-center">
          <Sidebar highlightIndex={4} />
          <Navbar />
        </div>

        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {loading ? (
              <Skeleton variant="text" width={200} height={40} />
            ) : user?.savedJobs?.length === 0 ? (
              "No Saved Jobs"
            ) : (
              "Saved Jobs"
            )}
          </h1>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-xl shadow-lg max-w-sm w-full flex flex-col gap-4"
                    >
                      <Skeleton variant="text" width="60%" height={20} />
                      <div className="flex items-center gap-4">
                        <Skeleton variant="rounded" width={56} height={56} />
                        <div className="flex-1">
                          <Skeleton variant="text" width="80%" height={25} />
                          <Skeleton variant="text" width="60%" height={20} />
                        </div>
                      </div>
                      <Skeleton variant="text" width="100%" height={60} />
                      <Skeleton variant="rounded" width="100%" height={70} />
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                      </div>
                    </div>
                  ))
                : user?.savedJobs?.map((job, idx) => (
                    <JobCard
                      key={idx}
                      jobType={job.jobType}
                      salary={job.salary}
                      vacancy={job.vacancy}
                      description={job.description}
                      location={job.location}
                      companyName={job.company}
                      role={job.title}
                      datePosted={job.createdAt}
                      id={job._id}
                      companyLogo={job.logo}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
