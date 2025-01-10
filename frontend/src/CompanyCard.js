import React, { useEffect, useContext } from "react";
import "./CompanyList.css";
import { Link } from "react-router-dom";
import { JoblyApi } from "./api/api";
import { UserContext } from "./UserContext"; // Import UserContext

function CompanyCard({ job, company }) {
  const { userApps, setUserApps } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserApplications = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          const userData = await JoblyApi.getUser(user.username);
          setUserApps(userData.applications);
        } catch (err) {
          console.error("Failed to fetch user applications:", err);
        }
      }
    };
    fetchUserApplications();
  }, [setUserApps]);

  const handleJobApp = async () => {
    try {
      const username = user.username;
      await JoblyApi.applyToJob({ username, job });
      let updatedUser = await JoblyApi.getUser(username);
      setUserApps(updatedUser.applications);
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
