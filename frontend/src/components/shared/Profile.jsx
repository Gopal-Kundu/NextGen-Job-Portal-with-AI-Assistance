import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { EditProfile } from "./EditProfile";
import LoadingOverlay from "../ui/LoadingOverlay";
import { Badge, ShieldCheck } from "lucide-react";
import PostedJobs from "../ui/PostedJobs";

export default function Profile() {
  const user = useSelector((store) => store.auth.user);
  const loading = useSelector((store) => store.auth.loading);
  const skillsArray = user.profile.skills
    .split(",")
    .map((skill) => skill.trim());

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
                {/* Profile Card */}
                <div className="relative md:col-span-1">
                  <div
                    className={`absolute z-2 flex items-center border w-min px-2 text-white font-semibold shadow-md rounded-2xl gap-1 ${
                      user.role === "recruiter"
                        ? "bg-gradient-to-r from-red-400 to-red-600 border-red-700"
                        : "bg-gradient-to-r from-blue-400 to-blue-600 border-blue-700"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> {user.role}
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="relative inline-block">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 mx-auto mb-4 ring-4 ring-primary-100"
                        style={{
                          backgroundImage: `url("${
                            user.profile?.profilePhoto ||
                            "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
                          }")`,
                        }}
                      />
                      <EditProfile />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.fullname || "Anonymous User"}
                    </h2>
                    <p className="text-md text-gray-600">
                      {user.profile?.bio || "No bio available"}
                    </p>

                    <div className="mt-6">
                      <div className="flex justify-center flex-wrap gap-2">
                        {user.profile?.skills
                          ? skillsArray.map((skill, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700 active:scale-90 transition-transform duration 100"
                              >
                                {skill.trim()}
                              </span>
                            ))
                          : null}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applied Jobs Table */}
                {user.role != "student" ? (
                  <PostedJobs postedJobs={user.postedJobs} />
                ) : (
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Applied Jobs
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
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
                            {user?.appliedJobs.map((job, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {job.company}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">
                                    {job.title}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium active:scale-90 transition-transform duration 100 ${
                                      job.status === "Accepted"
                                        ? "accepted-status bg-green-300"
                                        : "pending-status bg-blue-300"
                                    }`}
                                  >
                                    <svg
                                      className="w-2 h-2 mr-1.5"
                                      fill="currentColor"
                                      viewBox="0 0 8 8"
                                    >
                                      <circle cx="4" cy="4" r="3" />
                                    </svg>
                                    {job.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
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
      <Footer/>
    </>
  );
}
