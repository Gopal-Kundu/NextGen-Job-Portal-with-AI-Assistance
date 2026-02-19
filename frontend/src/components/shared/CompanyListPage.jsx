import React, { useState } from "react";
import CompanySetup from "./CompanySetup";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function CompanyListPage() {
  const [filter, setFilter] = useState("");
  const user = useSelector((store) => store.auth.user);
  const [createNewCompany, setCreateNewCompany] = useState(false);
  const companies = useSelector((store) => store.auth?.user?.createdCompanies);
  const filteredCompanies = companies?.filter((company) =>
    company?.name.toLowerCase().includes(filter.toLowerCase())
  );



  return (
    <>
      <div className="h-full relative flex items-center">
        <Sidebar highlightIndex={5} className="bg-gray-500" />
        <Navbar />
      </div>

      <div className="w-full min-h-screen relative">
        <div className="max-w-4xl mx-auto mt-10 p-6 min-h-0 max-h-1/2 overflow-auto bg-white shadow-md rounded-lg">
          {/* Header */}
          <div className={`${createNewCompany ? "block" : "hidden"}`}>
            {setCreateNewCompany ? (
              <CompanySetup cancel={() => setCreateNewCompany(false)} />
            ) : null}
          </div>

          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Filter by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => setCreateNewCompany(true)}
              className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 cursor-pointer"
            >
              New Company
            </button>
          </div>

          {/* Table */}
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-3">Logo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies?.map((company) => (
                <tr key={company?._id} className="border-t text-center">
                  <td className="p-3">
                    <img
                      src={
                        company?.logo ||
                        "https://media.wired.com/photos/65e88c25b8b2544099643d3d/master/w_1600,c_limit/aaaoriginal.jpg"
                      }
                      alt={company?.name}
                      className="w-10 h-10 object-contain mx-auto"
                    />
                  </td>

                  <td className="p-3">{company?.name}</td>

                  <td className="p-3">
                    <a
                      href={`/company/${company?._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md cursor-pointer"
                    >
                      Visit
                    </a>
                  </td> 
                </tr>
              ))}

              {filteredCompanies?.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer */}
          <p className="text-center text-gray-500 mt-4">
            A list of your recent registered companies
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
