import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import './index.css';
import { useState } from "react";
import Map from "./Map";
import axios from "axios";
import { toast } from "react-toastify";
import PointsShop from "./PointsShop";
import { refreshAccessToken } from "./utils";


function Dashboard({showPointsShop}) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [showMap, setShowMap] = useState(true);
    const [favoriteRoutes, setFavoriteRoutes] = useState([]);
    const [userPoints, setUserPoints] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        } else {
            setUsername(localStorage.getItem("username"));
            fetchUserPoints();
            localStorage.setItem("points", userPoints)
        }
    }, [navigate]);
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        localStorage.removeItem("points");
        navigate("/login");
    }
    const handleFavoriteRoutesClick = async () => {
        setShowMap(false); 
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        }
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/routes/get-favorites/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                console.log("Favorite Routes:", response.data);
                length = response.data.favorites.length;
                console.log("test", response.data.favorites[length-1]);
                // Handle the favorite routes data as needed
                setFavoriteRoutes(response.data.favorites);
            }
            
        }
        catch (error) {
            console.error("Error fetching favorite routes:", error);
            // Handle error as needed
            if (error.response && error.response.status === 401) {
                navigate("/login");
            } else {
                console.error("Error fetching favorite routes:", error.message);
            }
        }
    }
    const handleDeleteFavoriteRoute = async (routeId) => {
        const token  = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        }
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/routes/delete-favorite/${routeId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                console.log("Favorite Route deleted successfully:", response.data);
                toast.success("Favorite Route deleted successfully!");
                setFavoriteRoutes((prevRoutes) => prevRoutes.filter((route) => route.route_id !== routeId));
            }
            else if (response.status === 404) {
                toast.error("Favorite Route not found!");
            }
        } catch (error) {
            console.error("Error deleting favorite route:", error);
        }
    }
    /*const fetchUserPoints = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.get("http://localhost:8000/api/user/get_points/",{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.status === 200){
                setUserPoints(response.data.points);
            }
        }catch(error) {
            console.error("Error fetching user points", error);
            if(error.response && error.response.status === 401)
                navigate("/login");
        }
    };*/
    const fetchUserPoints = async () => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/get_points/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        
        setUserPoints(response.data.points);

    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            const newToken = await refreshAccessToken();

            if (newToken) {
                try {
                    const retryResponse = await axios.get("http://127.0.0.1:8000/api/user/get_points/", {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });

                    if (retryResponse.status === 200) {
                        setUserPoints(retryResponse.data.points);
                    }
                } catch (retryError) {
                    console.error("Retry after refresh failed:", retryError);
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        } else {
            console.error("Error fetching user points", error);
        }
    }
};

    const handleHomeClick = () => {
        navigate("/dashboard");
        setShowMap(true);
    }
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }
    const handleRouteReportClick = () => {
        navigate("/report-route");
    }
    return (
        <div className="dashboard">
            <header>
                <nav className="navbar-links">
                    <button className="navbar-button" onClick={handleHomeClick}>
                        Map
                    </button>
                    <button className="navbar-button-favRoutes" onClick={handleFavoriteRoutesClick}>
                        Favorite Routes
                    </button>
                    <button className="navbar-button-shop" onClick={() => navigate("/points-shop")}>
                        Points Shop
                    </button>
                    <button className="navbar-button-logout" onClick={handleRouteReportClick}>
                        Report Route
                    </button>
                    <button onClick={handleLogout} className="navbar-button-logout">
                        Logout
                    </button>
                    <div className="user-points">
                        Points: <strong>{userPoints}</strong>
                    </div>
                </nav>
                <img src="/media/UrbanFlow.png" className="points-logo"  />
                <h1>Dashboard</h1>
                <p>Welcome, {username}!</p>
                
            </header>
            <main>
                {showPointsShop ? (
                    <PointsShop />
                ) : showMap ? (
                    <Map fetchUserPoints={fetchUserPoints} />
                ) : (
                    <div className="favorite-routes">
                        <h2>Favorite Routes:</h2>
                        {favoriteRoutes.length > 0 ? (
                            <ul>
                                {favoriteRoutes.map((route, index) => (
                                    <li key={index}>
                                        <p className="favorite-routes-p">{route.route_name}</p>
                                        <button className="favorite-routes-button" onClick={() => handleDeleteFavoriteRoute(route.route_id, username)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No favorite routes found.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;