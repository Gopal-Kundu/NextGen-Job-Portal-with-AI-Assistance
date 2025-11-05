import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/address";
import { toast } from "sonner";
import axios from "axios";
import { setLoading } from "@/redux/authSlice";

export function EditProfile() {
  const user = useSelector((store) => store.auth.user);
  const loading = useSelector((store) => store.auth.loading);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullname: "",
    role: "",
    phonenumber: "",
    bio: "",
    skills: "",
  });

  const [profilePhoto, setprofilePhoto] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        role: user.role || "student",
        phonenumber: user.phonenumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills || "",
      });
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      fullname: user.fullname || "",
      role: user.role || "student",
      phonenumber: user.phonenumber || "",
      bio: user.profile?.bio || "",
      skills: user.profile?.skills || "",
    });
    setprofilePhoto("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("fullname", formData.fullname);
    form.append("role", formData.role);
    form.append("phonenumber", formData.phonenumber);
    form.append("bio", formData.bio);
    form.append("skills", formData.skills);
    if (profilePhoto) form.append("profilePhoto", profilePhoto);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          duration: 2000,
        });
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setTimeout(() => dispatch(setLoading(false)), 2000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="absolute bottom-2 right-2 bg-primary-600 rounded-full shadow-md hover:bg-primary-700 cursor-pointer active:scale-95 transition-transform duration-100 bg-gray-300 p-2"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] w-full bg-white rounded-lg p-4 sm:p-5">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Full Name</label>
            <input
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Email</label>
            <input
              disabled
              value={user?.email || ""}
              className="border rounded px-2 py-1 text-sm bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Phone Number</label>
            <input
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Profile Photo</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => setprofilePhoto(e.target.files[0])}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm">Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Role</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                />
                Student
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                />
                Recruiter
              </label>
            </div>
          </div>

          <DialogFooter className="pt-3 md:col-span-2 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" size="sm">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
