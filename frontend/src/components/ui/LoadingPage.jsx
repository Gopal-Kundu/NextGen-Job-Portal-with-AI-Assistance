import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="text-center">
        <Loader2 className="animate-spin text-white mx-auto mb-4" size={64} />
        <h1 className="text-white text-3xl font-bold mb-2">Loading, please wait...</h1>
      </div>
    </div>
  );
}
