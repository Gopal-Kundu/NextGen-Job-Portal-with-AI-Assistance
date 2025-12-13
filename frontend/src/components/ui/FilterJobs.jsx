import React from 'react'



function FilterJobs() {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
  <div className="bg-white p-6 rounded-lg shadow-lg">
    
    <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md space-y-5">
  <h2 className="text-lg font-semibold">Filter Jobs</h2>

  {/* vacancy */}
  <div>
    <p className="text-sm font-medium mb-2">Vacancy</p>
    <div className="flex gap-3">
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Ascending
      </span>
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Descending
      </span>
    </div>
  </div>

  {/* Salary */}
  <div>
    <p className="text-sm font-medium mb-2">Salary</p>
    <div className="flex gap-3">
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Low → High
      </span>
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        High → Low
      </span>
    </div>
  </div>

  {/* Job Type */}
  <div>
    <p className="text-sm font-medium mb-2">Job Type</p>
    <div className="flex flex-wrap gap-3">
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Internship
      </span>
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Full-Time
      </span>
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Part-Time
      </span>
      <span className="px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100">
        Contract
      </span>
    </div>
  </div>

  {/* Location */}
  <div>
    <p className="text-sm font-medium mb-2">Location</p>
    <input
      type="text"
      placeholder="Enter location"
      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
</div>


    
  </div>
</div>

  )
}

export default FilterJobs