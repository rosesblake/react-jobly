import React, { useEffect, useContext } from "react";
import "./CompanyList.css";
import { Link } from "react-router-dom";
import { JoblyApi } from "./api/api";
import { UserContext } from "./UserContext"; // Import UserContext

function CompanyCard({ job, company }) {
  const { setCurrUser } = useContext(UserContext);
  const { userApps, setUserApps } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleJobApp = async () => {
    try {
      const username = user.username;
      await JoblyApi.applyToJob({ username, job });
      let updatedUser = await JoblyApi.getUser(username);
      console.log(updatedUser);
      setUserApps(updatedUser.applications);
      setCurrUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to apply to job:", err);
    }
  };
  // console.log(userApps);
  return (
    <div className="Company-card-container">
      {job ? (
        <ul className="Company-card">
          <li>{job.title}</li>
          <li>Salary: {job.salary || "N/A"}</li>
          <li>Equity: {job.equity || "N/A"}</li>
          <button onClick={handleJobApp}>
            {userApps.includes(job.id) ? "Applied" : "Apply"}
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
