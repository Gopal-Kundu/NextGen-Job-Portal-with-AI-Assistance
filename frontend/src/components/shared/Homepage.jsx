import Footer from "./Footer";
import Navbar from "./Navbar";
import JobsListing from "./JobsListing";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/address";
import { useDispatch } from "react-redux";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Homepage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  function search(query) {
    if (query.trim() !== "") navigate(`/search?query=${query}`);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") search(value);
  };

  const fetchTrendingJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${JOB_API_END_POINT}/trending`);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingJobs();
  }, []);

  return (
    <>
      {!loading ? (
        <Skeleton
          variant="text"
          height={80}
        />
      ) : (
        <div className="h-full relative flex items-center">
          <Sidebar highlightIndex={1} />
          <Navbar />
        </div>
      )}

      <div className="min-h-[800px] h-full bg-gray-50 p-4 select-none md:select-auto w-full">
        <main className="mt-8 text-center">
          {!loading ? (
            <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
              <Skeleton
                variant="text"
                width={200}
                height={40}
                sx={{ margin: "0 auto" }}
              />
              <Skeleton
                variant="text"
                sx={{
                  margin: "0 auto",
                  width: {
                    xs: "220px",
                    sm: "320px",
                    md: "500px",
                  },
                }}
                height={70}
              />
              <Skeleton
                variant="rounded"
                height={64}
                sx={{
                  borderRadius: "9999px",
                  width: {
                    xs: "300px",
                    sm: "400px",
                    md: "600px",
                  },
                }}
              />
            </Stack>
          ) : (
            <>
              <span className="inline-block bg-red-100 text-red-500 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                No. 1 Job Hunt Website
              </span>

              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Search, Apply
                <br />
                Get Your <span className="text-purple-700">Dream Jobs</span>
              </h2>

              <div className="mt-10 max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    id="job-search"
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    name="jobSearch"
                    className="w-full h-16 p-5 rounded-full text-xl md:text-3xl text-gray-700 focus:outline-none focus:border-indigo-500 border border-black"
                    placeholder="Find your dream jobs"
                    type="text"
                  />

                  <button
                    onClick={() => search(value)}
                    className="active:scale-90 absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700"
                  >
                    <span className="material-icons">search</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {!loading ? (<Skeleton
          variant="text"
          height={80}
        />) :(<h3 className="text-2xl mb-3 md:text-3xl font-bold text-gray-800 mt-10">
          <span className="text-purple-700">Latest and Top</span> Job Openings
        </h3>)}

        {!loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
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
            ))}
          </div>
        ) : (
          <JobsListing jobs={jobs} />
        )}
      </div>

      <Footer />
    </>
  );
}
