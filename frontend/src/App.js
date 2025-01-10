import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // Importing the UserContext
import { CompanyList } from "./CompanyList";
import Home from "./Home.js";
import LoginForm from "./LoginForm.js";
import NavBar from "./NavBar.js";
import Company from "./Company.js";
import { JobList } from "./JobList.js";
import SignupForm from "./SignupForm.js";
import { JoblyApi } from "./api/api.js";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute

function App() {
  const { token, setToken, currUser, setCurrUser } = useContext(UserContext);
  const [userApps, setUserApps] = useState(null);

  useEffect(() => {
    if (currUser && currUser.username && token) {
      const fetchUserApps = async () => {
        try {
          const uApps = await JoblyApi.getUser(currUser.username);
          const apps = uApps.applications;
          console.log(apps);
          // Update state only if apps are different
          setUserApps((prevApps) => {
            if (JSON.stringify(prevApps) !== JSON.stringify(apps)) {
              return apps;
            }
            return prevApps;
          });
        } catch (error) {
          console.error("Error fetching user applications", error);
          if (error.response && error.response.status === 401) {
            console.log("Token is expired or invalid, please log in again.");
            setToken(null);
            setCurrUser(null);
          }
        }
      };

      fetchUserApps();
    }
  }, [currUser, token, setToken, setCurrUser]);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar token={token} setToken={setToken} />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Home token={token} currUser={currUser} />}
          />
          <Route
            path="/login"
            element={
              <LoginForm setToken={setToken} setCurrUser={setCurrUser} />
            }
          />
          <Route
            path="/signup"
            element={
              <SignupForm
                setToken={setToken}
                profileEdit={false}
                setCurrUser={setCurrUser}
              />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/companies"
            element={
              <ProtectedRoute token={token}>
                <CompanyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:handle"
            element={
              <ProtectedRoute token={token}>
                <Company userApps={userApps} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute token={token}>
                <JobList userApps={userApps} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute token={token}>
                <SignupForm profileEdit={true} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
