import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import EnterResumeForm from "../ui/EnterResumeForm";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ResumePage() {
  const loading = useSelector((store) => store.auth.loading);
  const user = useSelector((store) => store.auth.user);
  const [hideForm, setHideForm] = useState(true);

  return (
    <>
      <div className="relative">
        {!hideForm && <EnterResumeForm isHide={() => setHideForm(true)} />}
        {loading && (
          <LoadingOverlay message="Resume is Uploading... Please Wait..." />
        )}

        <div className="h-full relative flex items-center">
          <Sidebar highlightIndex={3} className="bg-gray-500" />
          <Navbar />
        </div>

        {/* Main Content */}
        <main className="flex-1 py-12 min-h-screen">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {user?.profile?.resume
                  ? "Here is your Resume"
                  : "Kindly Upload your Resume"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your resume and portfolio to stand out to employers.
              </p>
            </div>

            <div className="flex justify-center space-y-10">
              {/* Resume Section */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex flex-col items-start gap-6 sm:flex-row">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {user?.profile?.resume ? "Current Resume" : null}
                      </h2>

                      <div className="mt-4 flex flex-col justify-center gap-4 ">
                        {user?.profile?.resume && (
                          <button
                            className="btn-secondary cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                          >
                            <span className="cursor-pointer material-icons text-base">
                              visibility
                            </span>
                            <Link to={user?.profile?.resume}><span>View Resume</span></Link>
                          </button>
                        )}
                        <button
                          onClick={() => setHideForm(false)}
                          className="cursor-pointer btn-primary flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        >
                          <span className="material-icons text-base">
                            cloud_upload
                          </span>
                          <span>Upload New</span>
                        </button>
                      </div>
                    </div>

                    <div className="w-full flex-shrink-0 sm:w-56">
                      <div
                        className="h-[50vh] w-[40vh] md:w-full rounded-md border border-gray-200 bg-cover bg-center shadow-inner"
                        style={{
                          backgroundImage: !user?.profile?.resume
                            ? `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsm2iggcb30sJ6Iup-eXrdHUZkcpn6816XfkiRfCQj4_uJxRDSMnH_KSmSYHd5Rf73dEkkXex6TKkzfZ3sS7SqFso7wlueqGGCSfRcAenYii6EZ8bH8J2n81CE5jYGR2CN3_V9aqJRRIQypA385mZWqplNjlckItBkwjTUDqDKiW6VfRfDeMnHTI1Y8AM8410oDlICo5em5jAH0lNPjrXqBp8dhKxuc4ObbRoa8iKL7WEqEbWxWhYCX9IppDay2TxyAMY9-x1sqYE")`
                            : "none",
                        }}
                      >
                        {user?.profile?.resume && (
                          <iframe
                            src={user?.profile?.resume}
                            title="Resume Preview"
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
