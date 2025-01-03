import React, { useState, useEffect } from "react";
import { JoblyApi } from "./api/api.js";
import CompanyCard from "./CompanyCard.js";

function CompanyList() {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const companyData = await JoblyApi.getAllCompanies();
        setCompanies(companyData);
      } catch (e) {
        console.error("Error fetching companies:", e);
      }
    }
    fetchCompanies();
  }, []);

  if (!companies) return <h1>Loading...</h1>;

  return (
    <>
      <div className="Company-list-container">
        {companies.map((company) => {
          return <CompanyCard key={company.handle} company={company} />;
        })}
      </div>
    </>
  );
}

export { CompanyList };
