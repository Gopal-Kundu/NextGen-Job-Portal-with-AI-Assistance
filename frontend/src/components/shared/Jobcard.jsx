import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/address";
import {
  ArrowRightIcon,
  Bookmark,
  CheckCircle,
  Info,
  Share,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import LoadingOverlay from "../ui/LoadingOverlay";
import { setJobs } from "@/redux/jobSlice";
import { useState } from "react";

const cutwords = (word) => {
  const words = word.split(" ");
  if (words.length > 50) return words.slice(0, 50).join(" ") + "...";
  return words.join(" ");
};

export default function JobCard({
  id,
  jobType,
  salary,
  vacancy,
  description,
  location,
  companyName,
  role,
  datePosted,
}) {
  const formattedDate = new Date(datePosted).toISOString().split("T")[0];
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const loading = useSelector((store) => store.auth.loading);

  async function bookmarkHandler() {
    if (!user) {
      return toast.error("You must login first..", {
        duration: 2000,
        position: "top-center",
      });
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/bookmark`,
        { jobId: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        toast.success(res.data.message || "Job unsaved", {
          position: "top-center",
          duration: 2000,
        });
      }
      if (res.status === 202) {
        toast.success(res.data.message || "Job saved", {
          position: "top-center",
          duration: 2000,
        });
      }

      dispatch(
        setUser({
          ...user,
          savedJobs: res.data.savedJobs,
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 500);
    }
  }

  async function applyHandler() {
    if (!user) {
      return toast.error("You must login first..", {
        duration: 2000,
        position: "top-center",
      });
    }

    if (user?.role !== "student") {
      return toast.error("You must be a student to apply...", {
        duration: 2000,
        position: "top-center",
      });
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/apply`,
        { jobId: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        toast.success(
          res.data.message || "Your application has been removed.",
          {
            position: "top-center",
            duration: 2000,
          }
        );
      }
      if (res.status === 202) {
        toast.success(res.data.message || "Successfully applied to the job.", {
          position: "top-center",
          duration: 2000,
        });
      }

      dispatch(
        setUser({
          ...user,
          appliedJobs: res.data.appliedJobs,
        })
      );
      dispatch(setJobs(res.data.allJobs));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 500);
    }
  }
  if (loading) {
    return <LoadingOverlay message="Loading... wait a sec..." />;
  }
  return (
    <div className="grid grid-col-1 bg-white p-5 rounded-xl shadow-lg max-w-sm w-full transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Posted on {formattedDate}
        </span>
        <button
          className={`cursor-pointer active:scale-110  hover:text-indigo-600 ${
            user?.savedJobs?.some((job) => job._id === id) ? "text-indigo-600" : "text-gray-400"
          } transition-colors`}
        >
          <Bookmark onClick={bookmarkHandler} />
        </button>
      </div>

      <div className="flex items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{role}</h2>
          <p className="text-gray-500 text-sm">
            {companyName} - {location}
          </p>
        </div>
      </div>

      <p className="grid grid-cols-1 gap-2 text-[14px] text-gray-600 mb-4 text-sm leading-relaxed">
        {cutwords(description)}
      </p>

      <div className="grid grid-col-3 border-t-2 border-b-2 border-dashed border-gray-200 py-4 mb-4 mt-auto">
        <div className="flex items-center justify-between text-center text-sm">
          <div className="flex-1">
            <p className="uppercase text-gray-500">Vacancy</p>
            <p className="font-semibold text-gray-800">{vacancy}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 mx-2"></div>
          <div className="flex-1">
            <p className="uppercase text-gray-500">Type</p>
            <p className="font-semibold text-indigo-600">{jobType}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 mx-2"></div>
          <div className="flex-1">
            <p className="uppercase text-gray-500">Salary</p>
            <p className="font-semibold text-gray-800">{salary}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-[14px] mt-auto">
        <Link to={`/jobs/${id}`}>
          <button className="cursor-pointer active:scale-110 flex items-center justify-center bg-gray-100 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 px-2">
            <Info />
            Details
          </button>
        </Link>

        <button className="cursor-pointer active:scale-110 flex items-center justify-center bg-gray-100 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 px-2">
          <Share />
          Share
        </button>

        <button
          type="button"
          onClick={applyHandler}
          className="cursor-pointer active:scale-110 flex items-center justify-center bg-[#8200db] text-white font-semibold py-2 rounded-lg hover:bg-[#591188] transition-all duration-300 px-2"
        >
          {user?.appliedJobs?.some((job) => job._id === id) ? (
            <>
              <CheckCircle className="inline text-white" /> Applied
            </>
          ) : (
            <>
              <ArrowRightIcon />
              Apply
            </>
          )}
        </button>
      </div>
    </div>
  );
}
