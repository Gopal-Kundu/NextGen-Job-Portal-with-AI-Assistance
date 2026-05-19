import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/address";

export default function EnterResumeForm({ isHide }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const loading = useSelector((store) => store.auth.loading);
  const [resume, setResumeFile] = useState(user?.profile?.resume);
  const [submitHide, setSubmitHide] = useState(true);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setSubmitHide(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (!resume) {
      toast("Please select a resume file to upload.");
      return;
    }
    isHide();
    const form = new FormData();
    form.append("resume", resume);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/resume/upload`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Resume uploaded successfully!", {
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error("Something is Wrong... Please try again later.", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {user ? (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Upload Your Resume
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full">
                <input
                  type="file"
                  id="resume"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="resume"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition"
                >
                  <span className="text-blue-600 font-semibold">
                    Click to upload resume
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {resume ? resume.name : "PDF, DOC, DOCX"}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                {submitHide ? null : (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition"
                  >
                    Submit
                  </button>
                )}

                <button
                  type="button"
                  onClick={isHide}
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 active:scale-95 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
