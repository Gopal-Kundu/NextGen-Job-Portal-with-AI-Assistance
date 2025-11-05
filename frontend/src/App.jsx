import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/shared/Homepage";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Profile from "./components/shared/Profile";
import Jobs from "./components/shared/Jobs";
import ResumePage from "./components/shared/ResumePage";
import SavedJobs from "./components/shared/SavedJobs";
import ErrorPage from "./components/shared/errorPage";
import JobDescription from "./components/shared/JobDescription";
import axios from "axios";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import { useEffect, useState } from "react";
import { JOB_API_END_POINT, USER_API_END_POINT } from "./utils/address";
import { setJobs } from "./redux/jobSlice";
import { toast } from "sonner";
import CompanyListPage from "./components/shared/CompanyListPage";
import LoadingPage from "./components/ui/LoadingPage";
import { useDispatch } from "react-redux";
import ApplicationsList from "./components/shared/ApplicationList";
import CompanyPage from "./components/shared/CompanyPage";
import { setUser } from "./redux/authSlice";

const appRouter = createBrowserRouter([
  { path: "/", element: <Homepage />, errorElement: <ErrorPage /> },
  { path: "/login", element: <Login /> },
  { path: "/jobs/:id", element: <JobDescription /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/companies", element: <CompanyListPage /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/profile", element: <Profile /> },
  { path: "/resumepage", element: <ResumePage /> },
  { path: "/savedjobs", element: <SavedJobs /> },
  { path: "/applications/:id", element: <ApplicationsList /> },
  { path: "/company/:id", element: <CompanyPage /> },
]);

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`);
        dispatch(setJobs(res.data.jobs));
      } catch (err) {
        toast.error("Something is wrong", {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [dispatch]);

  useEffect(() => {
    const fetchUserIfLoggedIn = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${USER_API_END_POINT}/remember`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          dispatch(setJobs(res.data.allJobs));
        } else {
          const jobRes = await axios.get(`${JOB_API_END_POINT}/get`);
          dispatch(setJobs(jobRes.data.jobs));
        }
      } catch (err) {
        toast.error("Something is wrong", {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserIfLoggedIn();
  }, []);

  return (
    <>{loading ? <LoadingPage /> : <RouterProvider router={appRouter} />}</>
  );
}

export default App;
