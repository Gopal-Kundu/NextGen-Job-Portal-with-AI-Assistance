import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function ApplicationPage() {
  const { id } = useParams();
  const applications = useSelector((state) => state.applicant.applicants);
  const user = applications?.find((app) => app._id === id);

  const skillsArray =
    user?.profile?.skills?.length > 0
      ? user.profile.skills.split(",")
      : [];

  return (
    <div className="relative md:col-span-1 max-w-md mx-auto mt-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="relative inline-block">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 mx-auto mb-4 ring-4 ring-primary-100"
            style={{
              backgroundImage: `url("${
                user?.profile?.profilePhoto ||
                "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
              }")`,
            }}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {user?.fullname || "Anonymous User"}
        </h2>

        <p className="text-md text-gray-600 mb-4">
          {user?.profile?.bio || "No bio available"}
        </p>

        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {skillsArray.map((skill, i) => (
            <span
              key={i}
              className="rounded-full bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700 active:scale-90 transition-transform"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded hover:bg-green-700">
            Approve
          </button>
          <button className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700">
            Reject
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Resume</h3>
        {user?.profile?.resume ? (
          <iframe
            src={user.profile.resume}
            title="Resume"
            className="w-full h-64 rounded border"
          />
        ) : (
          <p className="text-gray-500 text-center py-16">
            No resume provided.
          </p>
        )}
      </div>
    </div>
  );
}

export default ApplicationPage;
