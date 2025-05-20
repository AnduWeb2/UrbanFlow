import { useState } from "react";
import axios from "axios";
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";


function CitizenLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://fiicode-urbanisation.onrender.com/api/user/citizen/login/', formData);
            toast.success('Login successful!'); 
            console.log('Login Response:', response.data);
            const tokenresponse = await axios.post('https://fiicode-urbanisation.onrender.com/api/user/token/', {
                username: formData.username,
                password: formData.password
            });
            console.log("Access token response:", tokenresponse.data.access);
            console.log("Refresh token response:", tokenresponse.data.refresh);
            localStorage.setItem('access_token', tokenresponse.data.access);
            localStorage.setItem('refresh_token', tokenresponse.data.refresh);
            localStorage.setItem('username', response.data.username); 
            navigate('/dashboard'); 
            
        } catch (error) {
            if (error.response && error.response.status === 401 || error.response.status === 404) {
                toast.error('Invalid username or password. Please try again.');
            } else {
                toast.error('Login failed. Please try again later.');
            }
            console.error('Login Error:', error.response?.data || error.message);
        }
    }
    const handleaccountexists = () => {
        navigate('/register');
    }
    return (
        <>
        
        <div className="login-form">
            
            <h2>Citizen Login</h2>

            <form onSubmit={handleSubmit}>
                <img src="/media/UrbanFlow.png"  className="logo-login"/>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="username" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <a onClick={handleaccountexists}>Register here</a></p>
            </form>
        </div>
        <p className="staff-redirect">Are you a staff member? <a href="/staff-login">Click here</a></p>
        </>
    );
}

export default CitizenLogin;