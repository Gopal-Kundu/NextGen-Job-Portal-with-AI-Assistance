import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { USER_API_END_POINT } from "@/utils/address";
import axios from "axios";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useSelector } from "react-redux";
import { data } from "react-router-dom";

function NotificationPage() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsMessages, setNotificationsMessages] = useState([]);
  const [companyLogo, setCompanyLogo] = useState("");
  const user = useSelector((store) => store.auth.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getNotifications() {
      try {
        setLoading(true);

        const res = await axios.get(
          `${USER_API_END_POINT}/notification/${user._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setNotificationCount(res.data.notifications?.newMessageCount);
          setNotificationsMessages(res.data.notifications?.allMessages);
          setCompanyLogo(res.data.notifications?.companyLogo);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    getNotifications();
  }, []);

  if (loading) return <LoadingOverlay message="Wait a Second..." />;

  return (
    <div>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={0} />
        <Navbar />
      </div>

      <div className="p-6">
        {notificationsMessages.length == 0 ? (
          <h1 className="text-3xl font-bold mb-4">No Notifications Found</h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Notifications</h1>
            {notificationsMessages.slice().reverse().map((n, index) => (
              <div
                key={index}
                className="w-full bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 mb-3 p-4 flex justify-between items-center relative"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl"></div>

                <div className="flex items-center gap-3 pl-3">
                  <img
                    src={n.companyLogo}
                    className="h-10 w-10 object-contain rounded-md border mr-5"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      {n.message}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.time).toLocaleString()}
                    </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
