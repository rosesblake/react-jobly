import React, {useState, useEffect} from "react";
import { JoblyApi } from "./api/api";
import { useParams } from "react-router-dom";
import CompanyCard from "./CompanyCard";

function Company({userApps}) {
    const [company, setCompany] = useState(null)
    const [jobs, setJobs] = useState(null)
    const {handle} = useParams();

    useEffect(() => {
        async function fetchCompany() {
            try {
                const companyData = await JoblyApi.getCompany(handle);
                setCompany(companyData)
                //should this have it's own function to get jobs?
                setJobs(companyData.jobs)
            } catch(e) {
                console.error('error fetching company details', e)
            }
        }
        fetchCompany()
    }, [handle])

    if(!company) return <h1>Loading...</h1>

return (
    <div className="Company-detail">
        <CompanyCard company={company} key={company.handle}/>
        {jobs.map(job => {
            return <CompanyCard key={job.id} job={job} userApps={userApps}/>
        })}

    </div>
)
}
export default Company;