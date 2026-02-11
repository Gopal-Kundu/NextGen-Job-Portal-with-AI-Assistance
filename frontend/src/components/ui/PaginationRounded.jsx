import { setLoading } from "@/redux/authSlice";
import { setFilterApplied, setJobs, setTotalJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/address";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "./LoadingOverlay";

export default function PaginationRounded() {
  let totalJobs = useSelector((state) => state.job.totalJobs);
  let filter = useSelector((state) => state.job.filter);
    let loading = useSelector((state)=> state.auth.loading);
  let isFilterApplied = useSelector((state) => state.job.filterApplied);
  const dispatch = useDispatch();
  totalJobs = Math.ceil(totalJobs / 6);
  const [page, setPageNo] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  useEffect(() => {
    async function getJobs() {
      try {
        dispatch(setLoading(true));
        if (isFilterApplied) {
          setDefaultPage(1);
          setPageNo(1);
          dispatch(setFilterApplied(false));
        } else {
          setDefaultPage(page);
        }
        const res = await axios.post(
          `${JOB_API_END_POINT}/filter/${page}`,
          filter
        );

        dispatch(setTotalJobs(res.data.countJobs));
        dispatch(setJobs(res.data.jobs));
      } catch (error) {
      } finally {
        dispatch(setLoading(false));
      }
    }

    getJobs(page);
  }, [page, filter]);
if(loading) return <LoadingOverlay message="Loading Jobs..."/>
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalJobs}
        shape="rounded"
        page={defaultPage}
        onChange={(e, pageno) => {
          setPageNo(pageno);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />
    </Stack>
  );
}
