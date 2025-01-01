import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // Import UserContext
import "./NavBar.css";

function NavBar() {
  const { token, logoutUser } = useContext(UserContext); // Use context for token and logoutUser
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/"); // After logout, navigate to home
  };

  return (
    <nav>
      {!token ? (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/companies">Companies</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
