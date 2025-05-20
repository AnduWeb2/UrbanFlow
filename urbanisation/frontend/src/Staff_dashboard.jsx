import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Map from "./Map";

function StaffDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [reports, setReports] = useState([]); // Lista de rapoarte
  const [viewDetails, setViewDetails] = useState(false); // Controlează afișarea detaliilor
  const [selectedReport, setSelectedReport] = useState(null); // Raportul selectat
  const [viewMap, setViewMap] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      setUsername(localStorage.getItem("staff-username"));
      fetchReports(); // Preia rapoartele la încărcarea paginii
    }
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://127.0.0.1:8000/api/raports/get/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setReports(response.data); // Stocăm rapoartele în state
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("staff-username");
    navigate("/staff-login");
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report); // Setează raportul selectat
    setViewDetails(true); // Afișează componenta `ReportDetails`
  };

  const handleBackToDashboard = () => {
    setViewDetails(false); // Revino la lista de rapoarte
    setSelectedReport(null); // Resetează raportul selectat
  };
  const handleHome = () => {
    navigate("/staff-dashboard")
    setViewMap(false)

  }
  const handleMap = () => {
    setViewMap(true)
    setViewDetails(false)
  }
  return (
    <div className="staff-dashboard">
      <header className="staff-header">
        <nav className="navbar-links">
          {viewMap ? (
            <button className="navbar-button" onClick={handleHome}>Home</button>
          ) :
            <button className="navbar-button" onClick={handleMap}>Map</button>
        }
          <button onClick={handleLogout} className="navbar-button-logout">
            Logout
          </button>
        </nav>
        <h1>Staff Dashboard</h1>
        <p>Hello, {username}! Welcome to the Staff Dashboard</p>
      </header>
      <main className="staff-dashboard-main">
        {viewMap && 
          <Map />
        }
        {viewDetails ? (
          <ReportDetails
            report={selectedReport}
            onBack={handleBackToDashboard}
             // Funcția pentru reîncărcarea rapoartelor
          />
        ) : (
          <>
            <h2>Manage Reports:</h2>
            <ul className="report-list">
              {reports.map((report) => (
                <li key={report.id} className="report-item">
                  <p>
                    <strong>{report.report_title}</strong> - {report.status}
                  </p>
                  <button
                    onClick={() => handleViewDetails(report)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

function ReportDetails({ report, onBack }) {
  const [reason, setReason] = useState(""); // Stocăm motivul pentru închiderea raportului
  const navigate = useNavigate(); // Folosit pentru navigare
  const handleCloseReport = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for closing the report.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/raports/close/${report.id}/`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Report closed successfully!");
        onBack(); // Revino la lista de rapoarte
      }
    } catch (error) {
      console.error("Error closing report:", error);
      toast.error("Failed to close the report. Please try again.");
    }
  };

  if (!report) {
    return <p>No report selected.</p>;
  }

  return (
    <div className="report-details">
      <h1>{report.report_title}</h1>
      <p><strong>Route Name:</strong> {report.route_name}</p>
      <p><strong>Details:</strong> {report.report_details}</p>
      <p><strong>Status:</strong> {report.status}</p>
      {report.status === "closed" && <p><strong>Reason:</strong> {report.reason}</p>}
      <p><strong>Created At:</strong> {new Date(report.created_at).toLocaleString()}</p>
      <p><strong>Created by: </strong> {report.user}</p>

      {report.status === "open" && (
        <div className="close-report">
          <textarea
            placeholder="Enter reason for closing the report"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="3"
          ></textarea>
          <button onClick={handleCloseReport} className="close-button">
            Close Report
          </button>
        </div>
      )}

      <button onClick={onBack} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
}

export default StaffDashboard;