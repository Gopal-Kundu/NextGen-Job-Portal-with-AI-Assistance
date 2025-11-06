import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import JobCard from "./Jobcard";
import { useState, useEffect } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/address";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchJob() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const [searchValue, setSearchValue] = useState(query);
  const handleSearch = () => {
    if (searchValue.trim() === "") return;
    navigate(`/search?query=${searchValue.trim()}`);
  };
  useEffect(() => {
    if (!query) return;

    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/search?query=${query}`
        );
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query]);

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="h-full flex items-center">
          <Sidebar highlightIndex={2} className="bg-gray-500" />
          <Navbar />
        </div>
        <div className="mt-10 ml-8 flex items-center gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search jobs..."
            className="cursor-pointer w-1/3 h-10 p-3 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all"
          >
            Search
          </button>
        </div>
        <div className="mt-10 ml-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {loading ? (
              "Loading..."
            ) : error ? (
              error
            ) : jobs.length === 0 ? (
              `No Jobs available for "${query}"`
            ) : (
              <>
                <span className="text-purple-700">Search Results for</span> "
                {query}"
              </>
            )}
          </h3>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {jobs.map((job, idx) => (
              <JobCard
                key={idx}
                jobType={job.type || job.jobType}
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
      <Footer />
    </>
  );
}
