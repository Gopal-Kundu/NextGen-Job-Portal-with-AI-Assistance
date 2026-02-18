import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center border border-white/20">
        
        {/* Error Code */}
        <h1 className="text-8xl font-extrabold text-white drop-shadow-lg animate-pulse">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-white mt-4">
          Oops! Page Not Found
        </h2>
        <p className="text-white/80 mt-3">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Countdown */}
        <p className="text-white/70 mt-6">
          Redirecting to home in{" "}
          <span className="font-bold text-white text-lg">{seconds}</span> seconds...
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-2xl bg-white text-purple-700 font-semibold shadow-lg hover:scale-105 hover:bg-purple-100 transition-all duration-300"
        >
          Go Home Now
        </button>
      </div>
    </div>
  );
}
