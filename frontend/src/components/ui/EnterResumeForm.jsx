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
        `${USER_API_END_POINT}/profile/update`,
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
    }catch(error){
        toast.error("Something is Wrong... Please try again later.",{
            position: "top-center",
            duration: 2000
        })
    } finally {
        dispatch(setLoading(false));
    }
  };

  return (
    <>
      {user ? (
          <div className="fixed inset-0 backdrop-filter backdrop-brightness-75 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>

              <form onSubmit={handleSubmit}>

                
                    <input
                  type="file"
                  
                  onChange={handleFileChange}
                  className="mb-4 cursor-pointer"
                />
                <div className="flex justify-between">
                {
                    submitHide ? (null):(<button
                    type="submit"
                    className="cursor-pointer bg-blue-300 active:scale-90 text-black px-4 py-2 rounded"
                  >
                    Submit
                  </button>)
                }
                
                  <button
                    type="button"
                    onClick={isHide}
                    className="bg-gray-300 cursor-pointer active:scale-90 text-black px-4 py-2 rounded"
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
