import React, { useState, useEffect, useContext } from "react";
import "./CompanyList.css";
import { Link } from "react-router-dom";
import { JoblyApi } from "./api/api";
import { UserContext } from "./UserContext"; // Import UserContext

function CompanyCard({ job, company }) {
  const { userApps } = useContext(UserContext); // Get userApps from context
  const user = JSON.parse(localStorage.getItem("user"));
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (userApps && job) {
      setApplied(userApps.some((app) => app === job.id));
    }
  }, [userApps, job]);

  const handleJobApp = async () => {
    try {
      const username = user.username;
      await JoblyApi.applyToJob({ username, job });
      setApplied(true);
    } catch (err) {
      console.error("Failed to apply to job:", err);
    }
  };

  return (
    <div className="Company-card-container">
      {job ? (
        <ul className="Company-card">
          <li>{job.title}</li>
          <li>Salary: {job.salary || "N/A"}</li>
          <li>Equity: {job.equity || "N/A"}</li>
          <button onClick={handleJobApp}>
            {applied ? "Applied" : "Apply"}
          </button>
        </ul>
      ) : (
        <Link to={`/companies/${company.handle}`} key={company.handle}>
          <div className="Company-card">
            <h2>{company.name}</h2>
            <p>{company.description}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default CompanyCard;
