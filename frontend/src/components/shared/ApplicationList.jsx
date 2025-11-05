import React from "react";
import { useNavigate } from "react-router-dom";

export default function ApplicationsList({ applications }) {
  applications = [
  {
    _id: "app_001",
    user: {
      _id: "user_101",
      fullname: "Riya Sharma",
      email: "riya@example.com",
      phonenumber: 9876543210,
      profile: {
        profilePhoto: "https://i.pravatar.cc/150?img=47",
        bio: "Final year CS student passionate about full-stack development.",
        skills: "JavaScript, React, Node.js, MongoDB",
        resume: "https://example.com/resume_riya.pdf"
      }
    },
    resume: "https://example.com/resume_riya.pdf",
    status: "pending"
  },
  {
    _id: "app_002",
    user: {
      _id: "user_102",
      fullname: "Arjun Patel",
      email: "arjun@example.com",
      phonenumber: 9991122334,
      profile: {
        profilePhoto: "https://i.pravatar.cc/150?img=59",
        bio: "Backend-focused developer. Loves solving problems.",
        skills: "Java, Spring Boot, SQL, Data Structures",
        resume: "https://example.com/resume_arjun.pdf"
      }
    },
    resume: "https://example.com/resume_arjun.pdf",
    status: "pending"
  },
  {
    _id: "app_003",
    user: {
      _id: "user_103",
      fullname: "Sneha Gupta",
      email: "sneha@example.com",
      phonenumber: 8884455667,
      profile: {
        profilePhoto: "https://i.pravatar.cc/150?img=32",
        bio: "UI/UX designer + frontend developer.",
        skills: "Figma, HTML, CSS, React",
        resume: "https://example.com/resume_sneha.pdf"
      }
    },
    resume: "https://example.com/resume_sneha.pdf",
    status: "accepted"
  }
];

  const navigate = useNavigate();

  if (!applications || applications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No applications yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      <div className="space-y-4">
        {applications?.map((app) => (
          <div
            key={app._id}
            className="border shadow-sm rounded-lg p-4 flex items-center justify-between"
          >
            {/* Left - User Info */}
            <div className="flex items-center gap-4">
              <img
                src={app?.user?.profile?.profilePhoto}
                alt="profile"
                className="w-14 h-14 rounded-full object-cover border"
              />

              <div>
                <p className="font-semibold text-lg">{app.user?.fullname}</p>
                <p className="text-gray-600">{app.user?.email}</p>
              </div>
            </div>

            {/* Right - View Button */}
            <button
              onClick={() => navigate("/view-application", { state: app.user })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
