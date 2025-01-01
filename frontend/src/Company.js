import React, { useState, useEffect, useContext } from "react";
import { JoblyApi } from "./api/api";
import { useParams } from "react-router-dom";
import CompanyCard from "./CompanyCard";
import { UserContext } from "./UserContext"; // Import UserContext

function Company() {
  const { handle } = useParams();
  const { userApps } = useContext(UserContext); // Get userApps from context
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const companyData = await JoblyApi.getCompany(handle);
        setCompany(companyData);
        setJobs(companyData.jobs);
      } catch (e) {
        console.error("Error fetching company details", e);
      }
    }
    fetchCompany();
  }, [handle]);

  if (!company) return <h1>Loading...</h1>;

  return (
    <div className="Company-detail">
      <CompanyCard company={company} key={company.handle} />
      {jobs.map((job) => {
        return <CompanyCard key={job.id} job={job} userApps={userApps} />;
      })}
    </div>
  );
}

export default Company;
