import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const { currUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If no currUser, redirect to login
    if (!currUser) {
      navigate("/login");
    }
  }, [currUser, navigate]); // Run when currUser changes

  // If there's no user, don't render the component yet
  if (!currUser) {
    return null; // Or a loading spinner, etc.
  }

  return (
    <div className="home-container">
      <h1 className="welcome-message">Welcome, {currUser.username}</h1>
      {/* Other content */}
    </div>
  );
}

export default Home;
