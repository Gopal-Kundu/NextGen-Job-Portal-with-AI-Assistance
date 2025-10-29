export default function LoadingOverlay({ message = "Loading... Please wait" }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-brightness-75"></div>

      {/* Loader box */}
      <div className="relative bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>

        {/* Message */}
        <p className="text-gray-800 font-medium">{message}</p>
      </div>
    </div>
  );
}
