import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { EditProfile } from "./EditProfile";
import LoadingOverlay from "../ui/LoadingOverlay";
import { ShieldCheck } from "lucide-react";
import PostedJobs from "../ui/PostedJobs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const user = useSelector((store) => store.auth.user);
  const id = user?._id;
  const loading = useSelector((store) => store.auth.loading);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const skillsArray = user?.profile?.skills
    ?.split(",")
    .map((skill) => skill.trim());

  const filteredAppliedJobs = user?.appliedJobs
    ?.slice()
    .reverse()
    .filter((job) => {
      const status = job?.approvedApplicant.includes(id)
        ? "approved"
        : job?.rejectedApplicant.includes(id)
          ? "rejected"
          : "pending";

      return (
        job?.company?.toLowerCase().includes(search.toLowerCase()) ||
        job?.title?.toLowerCase().includes(search.toLowerCase()) ||
        status.includes(search.toLowerCase())
      );
    });

  const filteredPostedJobs = user?.postedJobs?.filter((job) => {
    return (
      job?.company?.toLowerCase().includes(search.toLowerCase()) ||
      job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      job?.status?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <div className="w-full min-h-screen relative z-0">
        {loading ? <LoadingOverlay message="Updating Profile..." /> : null}
        <div className="h-full relative flex items-center">
          <Sidebar className="bg-gray-500" />
          <Navbar />
        </div>
        <div className="min-h-screen flex">
          <div className="flex-grow -mt-8">
            <main className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative md:col-span-1">
                  <div
                    className={`absolute z-2 flex items-center border w-min px-2 text-white font-semibold shadow-md rounded-2xl gap-1 ${user?.role === "recruiter"
                        ? "bg-gradient-to-r from-red-400 to-red-600 border-red-700"
                        : "bg-gradient-to-r from-blue-400 to-blue-600 border-blue-700"
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> {user?.role}
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="relative inline-block">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 mx-auto mb-4 ring-4 ring-primary-100"
                        style={{
                          backgroundImage: `url("${user?.profile?.profilePhoto ||
                            "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
                            }")`,
                        }}
                      />
                      <EditProfile />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {user?.fullname || "Anonymous User"}
                    </h2>
                    <p className="text-md text-gray-600">
                      {user?.profile?.bio || "No bio available"}
                    </p>

                    <div className="mt-6">
                      <div className="flex justify-center flex-wrap gap-2">
                        {skillsArray?.map((skill, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700 active:scale-90 transition-transform duration 100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {user?.role != "student" ? (
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md">
                      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Posted Jobs
                        </h3>
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search company, role, status..."
                          className="w-64 px-3 py-1.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <PostedJobs postedJobs={filteredPostedJobs} />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2 ">
                    <div className="bg-white rounded-lg shadow-md ">
                      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 ">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Applied Jobs
                        </h3>
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search company, role, status..."
                          className="w-64 px-3 py-1.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                Company Name
                              </th>
                              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                Job Role
                              </th>
                              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-center">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200">
                            {filteredAppliedJobs?.map((job, i) => {
                              const status = job?.approvedApplicant.includes(id)
                                ? "Approved"
                                : job?.rejectedApplicant.includes(id)
                                  ? "Rejected"
                                  : "Pending";

                              return (
                                <tr key={i}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/companyPage/${job?.company}`}><div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                      <img
                                        src={job?.logo}
                                        className="h-10 w-10 object-contain rounded-md border"
                                      />
                                      {job?.company}
                                    </div></Link>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div
                                      className="text-sm text-gray-600 cursor-pointer"
                                      onClick={() =>
                                        navigate(`/jobs/${job?._id}`)
                                      }
                                    >
                                      {job?.title}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span
                                      className={`px-3 py-1 rounded-xl font-semibold ${status === "Approved"
                                          ? "bg-green-100 text-green-700"
                                          : status === "Rejected"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                      {status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
