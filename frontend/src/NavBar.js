import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css"

function NavBar({token, setToken}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken(null)
        navigate('/')
    }
    return (
        <nav>
          {!token ? (
            <div className="navbar-links">
              <Link to='/login'>Login</Link>
              <Link to='/signup'>Signup</Link>
            </div>
          ) : (<div className="navbar-links">
            <Link to='/companies'>Companies</Link>
            <Link to='/jobs'>Jobs</Link>
            <Link to='/profile'>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>)}
        </nav>
      );
}

export default NavBar