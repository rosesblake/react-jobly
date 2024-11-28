import React, { useState, useEffect } from "react";
import { JoblyApi } from "./api/api.js";
import "./CompanyList.css";

function CompanyList() {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const companyData = await JoblyApi.getAllCompanies();
        setCompanies(companyData);
      } catch (e) {
        console.error("error fetching companies:", e);
      }
    }
    fetchCompanies();
  }, []);
  // Display a loading message while the data is being fetched
  if (!companies) return <h1>Loading...</h1>;
  return (
    <>
      <div className="companies-container">
        {companies.map((company) => {
          return (
            <div className="company-card" key={company.handle}>
              <h3>{company.name}</h3>
              <p>{company.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
export { CompanyList };
