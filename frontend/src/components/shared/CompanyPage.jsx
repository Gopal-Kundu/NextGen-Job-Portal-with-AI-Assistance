import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { COMPANY_API_END_POINT } from "@/utils/address";

export default function CompanyPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  const company = user?.createdCompanies?.find((c) => c._id === id);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await axios.get(`${COMPANY_API_END_POINT}/delete/${id}`,{
        withCredentials: true,
      });
      alert("Company deleted successfully");
      window.location.href = "/companies";
    } catch (error) {
      alert("Failed to delete company");
    }
  };

  if (!user)
    return (
      <div className="text-center mt-10 text-gray-500 text-lg">
        Loading user...
      </div>
    );

  if (!company)
    return (
      <div className="text-center mt-16 text-gray-500 text-lg">
        No Company Found.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={company.logo}
            alt="Company Logo"
            className="w-24 h-24 rounded-xl object-contain shadow-md border border-white"
          />
          <h1 className="text-4xl font-bold">{company.name}</h1>
        </div>
      </div>

      {/* Content Box */}
      <div className="bg-white p-6 rounded-b-xl shadow-xl border border-gray-100">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {company.description || "No description available"}
        </p>

        {company?.website && (
          <a
            href={
              `https://${company?.website}`
            }
            className="text-indigo-600 font-medium hover:text-indigo-800 underline text-lg"
          >
            🌐 Visit Website
          </a>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 transition-all duration-200 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg"
          >
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
}
