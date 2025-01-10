import React, { createContext, useState, useEffect } from "react";
import { JoblyApi } from "./api/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currUser, setCurrUser] = useState(null);
  const [userApps, setUserApps] = useState([]); // Added userApps state

  // Manage token and user data in localStorage and API calls
  useEffect(() => {
    JoblyApi.token = token; // Ensure token is set for API calls
    // Persist token in localStorage or remove it when null
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    // If token is available, check localStorage for user data, otherwise fetch it
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrUser(parsedUser); // Load user data from localStorage
        setUserApps(parsedUser.applications || []); // Load user applications
      } else {
        // Fetch user data from API if not in localStorage
        const fetchUser = async () => {
          try {
            const user = await JoblyApi.getUser(); // Assuming `getUser` uses token
            setCurrUser(user);
            setUserApps(user.applications || []); // Set user applications
            localStorage.setItem("user", JSON.stringify(user)); // Store in localStorage
          } catch (error) {
            console.error("Failed to fetch user:", error);
            setToken(null);
            setCurrUser(null);
            setUserApps([]); // Clear applications on error
          }
        };
        fetchUser();
      }
    } else {
      setCurrUser(null); // Clear user data if no token
      setUserApps([]); // Clear applications
    }
  }, [token]); // Runs whenever token changes

  const loginUser = async (data) => {
    try {
      const newToken = await JoblyApi.loginUser(data); // Get token from API
      setToken(newToken); // Update token in context

      // Fetch and set user details after login
      const user = await JoblyApi.getUser(data.username);
      setCurrUser(user); // Set the current user
      setUserApps(user.applications || []); // Set user applications

      localStorage.setItem("token", newToken); // Store token in localStorage
      localStorage.setItem("user", JSON.stringify(user)); // Store user data
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const registerUser = async (data) => {
    try {
      const newToken = await JoblyApi.registerUser(data); // Get token from API
      setToken(newToken); // Update token in context
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const logoutUser = () => {
    setToken(null);
    setCurrUser(null);
    setUserApps([]); // Clear applications on logout
    localStorage.removeItem("token"); // Clear token from localStorage
    localStorage.removeItem("user"); // Clear user data from localStorage
  };

  return (
    <UserContext.Provider
      value={{
        currUser,
        setCurrUser,
        token,
        setToken,
        userApps, // Pass userApps to context
        setUserApps, // Pass setUserApps to context if needed
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
