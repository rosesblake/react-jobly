import React, { useState, useContext } from "react";
import { JoblyApi } from "./api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./SignupForm.css";

function SignupForm({ profileEdit }) {
  const { setCurrUser, setToken } = useContext(UserContext); // <-- Make sure it's used here
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const INITIAL_STATE = !profileEdit
    ? {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
      }
    : {
        username: user.username,
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const hasEmptyFields = Object.values(formData).some(
      (value) => value.trim() === ""
    );
    if (hasEmptyFields) {
      setError("All fields must be filled out.");
      return;
    }

    try {
      setError(null);
      if (!profileEdit) {
        // New user signup
        const token = await JoblyApi.registerUser(formData);
        setToken(token);
        localStorage.setItem("token", token);
        setCurrUser(formData);
        localStorage.setItem("user", JSON.stringify(formData));
      } else {
        // Update user profile
        const updatedUser = await JoblyApi.updateUser(formData);
        setCurrUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setFormData(INITIAL_STATE);
      navigate("/");
    } catch (e) {
      console.error("Failed", e);
      setError("Invalid or missing fields");
    }
  };

  return (
    <div className="signup-form">
      {!profileEdit ? <h1>Sign up</h1> : <h1>Edit Profile</h1>}

      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          className="input-field"
          id="username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          readOnly={profileEdit} // Make username uneditable during profile edit
          autoComplete="username"
        />
        <label htmlFor="password">Password:</label>
        <input
          className="input-field"
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        <label htmlFor="firstName">First Name:</label>
        <input
          className="input-field"
          id="firstName"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          className="input-field"
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          className="input-field"
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
