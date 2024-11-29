import React from "react"
import { useState } from "react"
import { JoblyApi } from "./api/api"
import { useNavigate } from "react-router-dom"

function LoginForm({setToken, setCurrUser}) {
    const INITIAL_STATE = {
        username: "",
        password: ""
    }

    const [formData, setFormData] = useState(INITIAL_STATE)

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
        try {
            const token = await JoblyApi.loginUser(formData)
            const user = await JoblyApi.getUser(formData.username);
            setToken(token)
            setCurrUser(user)
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            setFormData(INITIAL_STATE)
            navigate('/')
        }catch(e){
            console.error('login failed', e);
            alert("invalid creds")
        }
    }

    return  <div>
        <h1>Log In</h1>
    <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input 
        id="username"
        name="username"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input 
        id="password"
        name="password"
        placeholder="password"
        value={formData.password}
        onChange={handleChange}
        />
        <button>Submit</button>
    </form>
    </div>
}

export default LoginForm