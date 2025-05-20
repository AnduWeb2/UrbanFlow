import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';


function RouteReport() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [formData, setFormData] = React.useState({
    routeName: "",
    reportTitle: "",
    reportDetails: "",
    username: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  
  useEffect(() => {
          const token = localStorage.getItem("access_token");
          if (!token) {
              navigate("/login");
          } else {
              setUsername(localStorage.getItem("username"));
          }
          const storedUsername = localStorage.getItem("username");
          setFormData((prevData) => ({
            ...prevData,
            username: storedUsername,
          }));
      }, [navigate]);
  
  const handleSubmit = async (e) => {                                             /// DE MODIFICAT
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
    try {
      const response = await axios.post('https://fiicode-urbanisation.onrender.com/api/raports/add/', formData);
      if (response.status === 201) {
        toast.success('Report submitted successfully!');
      }
      console.log('Report Response:', response.data);
      //navigate('/dashboard'); // Redirect to dashboard or home page after successful report submission
    } catch (error) {
      console.error('Report Error:', error.response?.data || error.message);
      toast.error('Failed to submit report. Please try again later.');
    }
  }
  const handleHomeClick = () => {
    navigate('/dashboard'); 
  }
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/login'); 
  }
  return (
    <div className="report-route">
      <header>
        <nav className="navbar-links">
          <button className="navbar-button" onClick={handleHomeClick}> Go back Home</button>
          <button className="navbar-button-logout" onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main>
        <h1>Report Route</h1>
        <p>Please provide the details of the route you want to report:</p>
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={username} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="routeName">Route Name:</label>
            <input type="text" id="routeName" name="routeName" onChange={handleChange} value={formData.routeName} required />
          </div>
          <div className="form-group">
            <label htmlFor='reportTitle'>Report Title:</label>
            <input type="text" id="reportTitle" name="reportTitle" onChange={handleChange} value={formData.reportTitle} required />
          </div>
          <div className="form-group">
            <label htmlFor="reportDetails">Report Details:</label>
            <textarea id="reportDetails" name="reportDetails"  onChange={handleChange} value={formData.reportDetails} required></textarea>
          </div>
          <button type="submit">Submit Report</button>
        </form>
      </main>
      
    </div>
  );
}
export default RouteReport;