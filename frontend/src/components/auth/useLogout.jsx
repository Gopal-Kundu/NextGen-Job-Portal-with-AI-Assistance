import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/address";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`,{
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
         toast.success("Logout Successful!", { position: "top-center", duration: 2000 });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!", { duration: 2000 });
    }
  };

  return logout;
};
