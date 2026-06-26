// src/hooks/useGetCompanyById.js
import { useState, useEffect } from "react";
import { getCompanyById } from "../api/api";

const useGetCompanyById = (id) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(id);

        if (data.success) {
          // Format the company data similar to useGetAllCompanies
          const formattedCompany = {
            value: data.company._id,
            label: data.company.name,
            name: data.company.name,
            logo: data.company.logo,
            createdAt: data.company.createdAt,
            description: data.company.description,
            location: data.company.location,
            website: data.company.website,
            userId: data.company.userId,
            updatedAt: data.company.updatedAt,
            recruiterName: data.company.recruiterName,
          };
          setCompany(formattedCompany);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  return { company, loading, error };
};

export default useGetCompanyById;
