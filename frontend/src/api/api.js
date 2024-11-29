import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getAllCompanies() {
    let res = await this.request(`companies`);
    return res.companies;
  }

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  static async getAllJobs() {
    let res = await this.request(`jobs`);
    return res.jobs
  }

  
  static async loginUser(data) {
    const res = await this.request(`auth/token`, data, "post")
    JoblyApi.token = res.token
    return res.token
  }

  static async registerUser(data) {
    const res = await this.request(`auth/register`, data, "post")
    JoblyApi.token = res.token
    return res.token
  }

  static async updateUser(data) {
    const { username, ...updatedData } = data; // Exclude username from the body
    const res = await this.request(`users/${username}`, updatedData, "patch");
    return res.user;
}

static async applyToJob({username, job}) {
  //it worked for a second without headers and im not sure why i had to figure this out now.
  const headers = { Authorization: `Bearer ${JoblyApi.token}` }; 
  const res = await this.request(`users/${username}/jobs/${job.id}`, { headers }, "post"); 
  const user = await this.request(`users/${username}`)
  return {res, user};
}



  static async getUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }
  


  // obviously, you'll add a lot here ...
}

// for now, put token ("testuser" / "password" on class)
JoblyApi.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
  "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
  "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export { JoblyApi };
