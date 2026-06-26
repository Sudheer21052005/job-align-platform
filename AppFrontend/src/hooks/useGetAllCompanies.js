// src/hooks/useGetAllCompanies.js
import { useState, useEffect } from "react";
import { getCompany } from "../api/api";

const useGetAllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompany();


        if (data.success) {
          const formattedCompanies = data.companies.map(company => ({
            value: company._id,          // Unique ID for frontend
            label: company.name,         // Display label
            name: company.name,          // Name for filtering
            logo: company.logo,          // Company logo
            createdAt: company.createdAt, // Registration date
            description: company.description, // Company description
            location: company.location,  // Location
            website: company.website,    // Website URL
            userId: company.userId,      // Owner/User ID
            updatedAt: company.updatedAt, // Last update timestamp
            recruiterName: company.recruiterName, // Recruiter's name who created the company
          }));


          setCompanies(formattedCompanies);
        } else {
          console.error("API returned error:", data.message);
          setError(data.message);
          setCompanies([]);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err.message);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};

export default useGetAllCompanies;
