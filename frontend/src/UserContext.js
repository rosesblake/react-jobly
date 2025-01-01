import React, { createContext, useState, useEffect } from "react";
import { JoblyApi } from "./api/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currUser, setCurrUser] = useState(null);

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
        setCurrUser(JSON.parse(storedUser)); // Load user data from localStorage
      } else {
        // Fetch user data from API if not in localStorage
        const fetchUser = async () => {
          try {
            const user = await JoblyApi.getUser(); // Assuming `getUser` uses token
            setCurrUser(user);
            localStorage.setItem("user", JSON.stringify(user)); // Store in localStorage
          } catch (error) {
            console.error("Failed to fetch user:", error);
            // Handle error if needed (e.g., clear token and user)
            setToken(null);
            setCurrUser(null);
          }
        };
        fetchUser();
      }
    } else {
      setCurrUser(null); // Clear user data if no token
    }
  }, [token]); // Runs whenever token changes

  const loginUser = async (data) => {
    try {
      const newToken = await JoblyApi.loginUser(data); // Get token from API
      setToken(newToken); // Update token in context

      // Fetch and set user details after login
      const user = await JoblyApi.getUser(data.username);
      setCurrUser(user); // Set the current user

      localStorage.setItem("token", newToken); // Store token in localStorage
      localStorage.setItem("user", JSON.stringify(user)); // Store user data
    } catch (err) {
      console.error("Login failed:", err);
      // Handle login failure (e.g., set an error message)
    }
  };

  const registerUser = async (data) => {
    try {
      const newToken = await JoblyApi.registerUser(data); // Get token from API
      setToken(newToken); // Update token in context

      // Optionally, you can fetch user data after registration
    } catch (err) {
      console.error("Registration failed:", err);
      // Handle registration failure (e.g., set an error message)
    }
  };

  const logoutUser = () => {
    setToken(null);
    setCurrUser(null);
    localStorage.removeItem("token"); // Clear token from localStorage
    localStorage.removeItem("user"); // Clear user data from localStorage
  };

  return (
    <UserContext.Provider
      value={{
        currUser,
        setCurrUser,
        token,
        setToken, // Pass setToken for updating token
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
