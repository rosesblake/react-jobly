import React, { useState, useEffect } from "react";
import { JoblyApi } from "./api/api.js";
import CompanyCard from "./CompanyCard.js";
import "./CompanyList.css";

function JobList({ userApps }) {
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobData = await JoblyApi.getAllJobs();
        setJobs(jobData);
      } catch (e) {
        console.error("Error fetching jobs:", e);
      }
    }
    fetchJobs();
  }, []);

  // Display a loading message while the data is being fetched
  if (!jobs) return <h1>Loading...</h1>;

  return (
    <div className="Job-list-container">
      {jobs.map((job) => {
        return <CompanyCard key={job.id} job={job} userApps={userApps} />;
      })}
    </div>
  );
}

export { JobList };
