import React from "react";
import { Link } from "react-router-dom";

function JobPortal() {
  return (
      <>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 select-none">
          <Link to="/"><div>
            Job <span className="text-purple-600">Portal</span>
          </div></Link>
        </h1>
      </>
  );
}

export default JobPortal;
