import React from "react";
import JobCard from "./Jobcard";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function JobsListing({ showJobs, smallDevice, jobs }) {
  const [num, setNum] = useState(showJobs);
  return (
    <div className="p-2">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {jobs?.length === 0 ? (
            <h1 className="text-5xl">No Job Found</h1>
          ) : (
            jobs
              .slice(0, num)
              .map((job, idx) => (
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
              ))
          )}
        </div>
      </div>
    </div>
  );
}
