import { setJobs, setTotalJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/address";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PaginationRounded() {
  let totalJobs = useSelector((state) => state.job.totalJobs);
  let filter = useSelector((state) => state.job.filter);
  const dispatch = useDispatch();
  totalJobs = Math.ceil(totalJobs / 6);
  const [page, setPageNo] = useState(1);


  useEffect(() => {
    async function getJobs(page) {
      console.log(filter);
      const res = await axios.post(
        `${JOB_API_END_POINT}/filter/${page}`,
        filter
      );
      dispatch(setTotalJobs(res.data.countJobs));
      dispatch(setJobs(res.data.jobs));
    }
    getJobs(page);
  }, [page, filter]);


  return (
    <Stack spacing={2}>
      <Pagination
        count={totalJobs}
        shape="rounded"
        onChange={(e, pageno) => setPageNo(pageno)}
      />
    </Stack>
  );
}
