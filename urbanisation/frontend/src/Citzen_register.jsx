import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function CitizenRegister() {
  const handleaccountexists = () => {
    navigate('/login');
  }
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    
  });
  const navigate = useNavigate(); 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/citzen/signup/', formData);
      
      console.log('Register Response:', response.data);
      toast.success('Registration successful!'); // Show success message using toast

      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
        if (error.response && error.response.status === 400) {
          // Verificăm dacă serverul returnează eroarea pentru email duplicat
          if (error.response.data.error && error.response.data.error.includes('UNIQUE constraint failed: user_citzen.email')) {
            
            toast.error('An account with this email already exists.'); 
          } 
          // Verificăm dacă serverul returnează eroarea pentru username duplicat
          else if (error.response.data.error && error.response.data.error.includes('UNIQUE constraint failed: user_citzen.username')) {
            
            toast.error('An account with this username already exists.');
          } 
          else {
            
            toast.error('Registration failed. Please try again.');
          }
        } else {
          
          toast.error('An unexpected error occurred. Please try again later.'); 
        }
        console.error('Register Error:', error.response?.data || error.message);
      }
  };

  
    return (
      <>
    <div className="citzen-register-form">
      <h2>Citizen Registration</h2>
      
      <form onSubmit={handleSubmit} >
        <img src="/media/UrbanFlow.png"  className="logo-login"/>
        <div>
            <label htmlFor = "first_name">First Name:</label>
            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
            <label htmlFor = "last_name">Last Name:</label>
            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
            <label>Transport Preferences:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="bus"
                  
                />
                Bus
              </label>
              <label>
                <input
                  type="checkbox"
                  value="metro"
                  
                />
                Metro
              </label>
              <label>
                <input
                  type="checkbox"
                  value="tram"
                  
                />
                Tram
              </label>
            </div>
          </div>
        <button type="submit">Register</button>
        <p>Already have an account? <a onClick={handleaccountexists}>Login here</a></p>
      </form>
    </div>
    <p className="staff-redirect">Are you a staff member? <a href="staff-login">Click here</a></p>
    </>
    );
  };

export default CitizenRegister;