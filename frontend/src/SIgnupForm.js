import React from "react"
import { useState } from "react"
import { JoblyApi } from "./api/api"
import { useNavigate } from "react-router-dom"

function SignupForm({setCurrUser, setToken, profileEdit}) {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    const INITIAL_STATE = !profileEdit ? {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    } : {
        username: user.username,
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }

    const [formData, setFormData] = useState(INITIAL_STATE)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
          // Check for empty fields
        const hasEmptyFields = Object.values(formData).some((value) => value.trim() === "");
        if (hasEmptyFields) {
            setError("All fields must be filled out.");
            return;
        }

        try {
            setError(null)
            if (!profileEdit) {
                //new user signup
                const token = await JoblyApi.registerUser(formData)
                setToken(token)
                localStorage.setItem('token', token)
                setCurrUser(formData)
                localStorage.setItem('user', JSON.stringify(formData))
            } else {
                //update user profile
                const updatedUser = await JoblyApi.updateUser(formData)
                localStorage.setItem('user', JSON.stringify(updatedUser))
                console.log(updatedUser)
            }
            setFormData(INITIAL_STATE)
            navigate('/')
        }catch(e){
            console.error('failed', e);
            setError('Invalid or missing fields')
        }
    }

    return  <div>
        {!profileEdit ? (<h1>Sign up</h1>) : (<h1>Edit Profile</h1>)}
        
        {error && <p style={{ color: "red" }}>{error}</p>}
    <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
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
          id="firstName"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <button>Submit</button>
    </form>
    </div>
}

export default SignupForm