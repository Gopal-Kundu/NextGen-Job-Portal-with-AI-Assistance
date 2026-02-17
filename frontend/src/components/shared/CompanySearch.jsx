import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/address";

const CompanySearch = () => {
  const { name } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          `${COMPANY_API_END_POINT}/companypage/${name}`
        );

        setCompany(response.data.company);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load company."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-3">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center">
        {company.logo && (
          <img
            src={company.logo}
            alt="Company Logo"
            className="w-28 h-28 object-contain mx-auto mb-6"
          />
        )}

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {company.name}
        </h1>

        <p className="text-gray-600 mb-6">
          {company.description}
        </p>

        <div className="space-y-2 text-gray-500">
          <p className="text-lg"> {company.location}</p>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-medium hover:underline"
            >
              🌐 Visit Website
            </a>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default CompanySearch;
