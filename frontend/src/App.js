import "./App.css";
import React, {useState, useEffect} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CompanyList } from "./CompanyList";
import Home from "./Home.js"
import LoginForm from "./LoginForm.js";
import NavBar from "./NavBar.js";
import Company from "./Company.js";
import { JobList } from "./JobList.js";
import SignupForm from "./SIgnupForm.js";
import { JoblyApi } from "./api/api.js";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currUser, setCurrUser] = useState(null)  
  const [userApps, setUserApps] = useState(null)
    //if you refresh the page, the currUser dissappears and i dont know what im doing wrong.
    // Update the state whenever the localStorage data changes
    //had to fetch data in here, because of infinite loop issues.
    useEffect(() => {
      if (currUser && currUser.username && token) {
        const fetchUserApps = async () => {
          try {
            const uApps = await JoblyApi.getUser(currUser.username);  // Ensure token is used in API request
            const apps = uApps.applications;
            setUserApps(apps);
          } catch (error) {
            console.error("Error fetching user applications", error);
            // Handle 401 (Unauthorized) error
            if (error.response && error.response.status === 401) {
              console.log("Token is expired or invalid, please log in again.");
            }
          }
        };
        fetchUserApps();
      }
    }, [currUser, token]);

  return (
    <div className="App">
      <BrowserRouter>
      <NavBar token={token} setToken={setToken}/>
        <Routes>
          {/* dont know a better way to handle if there is curr user then let them navigate  */}
          {currUser || token ?
          (<>
          <Route path="/" element={<Home token={token} currUser={currUser}/>}/>
          <Route path="/login" element={<LoginForm setToken={setToken} setCurrUser={setCurrUser}/>}/>
          <Route path="/signup" element={<SignupForm setToken={setToken} profileEdit={false} setCurrUser={setCurrUser}/>}/>
          <Route path="/companies" element={<CompanyList />}/>
          <Route path="/companies/:handle" element={<Company userApps={userApps}/>}/>
          <Route path='/jobs' element={<JobList userApps={userApps}/>}/>
          <Route path="/profile" element={<SignupForm profileEdit={true}/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>
          </>)
          :
          (<>
          <Route path="/" element={<Home token={token} currUser={currUser}/>}/>
          <Route path="/login" element={<LoginForm setToken={setToken} setCurrUser={setCurrUser}/>}/>
          <Route path="/signup" element={<SignupForm setToken={setToken} profileEdit={false} setCurrUser={setCurrUser}/>}/>
          </>)}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
