import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
      <h1 className="text-9xl font-extrabold tracking-wide animate-pulse">
        404
      </h1>

      <h2 className="text-4xl md:text-5xl font-bold mt-6">
        Oops! Page Not Found
      </h2>

      <p className="text-lg text-gray-200 mt-4 text-center max-w-md">
        Sorry, the page you're looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-transform duration-200 transform hover:-translate-y-1"
      >
        Go Back Home
      </Link>

      
    </div>
  );
}
