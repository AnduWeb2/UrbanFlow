import { use, useState } from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";



function StaffRegister() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        document_id: "",
        
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }
    const handleFileUpload = async (e) => {
        let file = e.target.files[0];
        let fileForm = new FormData();
        fileForm.append('file', file, file.name);
        if (file) {
            const response = await axios.post('http://127.0.0.1:8000/api/files/add/', fileForm);
            setFormData({...formData, document_id: response.data});
            console.log('File upload response:', response.data);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/staff/signup/', formData);
            console.log('Registration Response:', response.data);
            toast.success('Registration successful!');
            navigate('/staff-login'); // Redirect to login page after successful registration
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Registration Error:', error.response.data);
                toast.error('Registration failed. Please check your input.');
            } else {
                console.error('Registration Error:', error.message);
                toast.error('Registration failed. Please try again later.');
            }
        }
    }
    return (
        <div className="staff-register-form">
      <h2>Staff Registration</h2>
      
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
            <label htmlFor="document_id">Document:</label>
            <input type="file" id="document_id" name="document_id" onChange={handleFileUpload} required />
        </div>
        <button type="submit">Register</button>
        <p>Already have an account? <a href="/staff-login">Login here</a></p>
      </form>
    </div>
    );
}

export default StaffRegister;