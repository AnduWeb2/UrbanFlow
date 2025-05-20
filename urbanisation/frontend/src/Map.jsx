import React, { use, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { routes, trips, stops, stop_times } from "./Api_data.jsx";
import "leaflet/dist/leaflet.css";
import "./index.css";
import Routing from "./Routing.jsx";
import L from "leaflet";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "./utils";


function Map({fetchUserPoints}) {
    const mapRef = useRef(null);
    const searchBarRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRoutes, setFilteredRoutes] = useState(routes);
    const [showResults, setShowResults] = useState(false);
    const [stopsDetails, setStopsDetails] = useState([]);
    const [color, setColor] = useState("#000000");
    const [showPolyline, setShowPolyline] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [selectedRouteName, setSelectedRouteName] = useState("");
    const [lastSelectedRouteName, setLastSelectedRouteName] = useState("");
    const [routeFavorite, setRouteFavorite] = useState({
        route_id: null,
        route_name: "",
        token: "",
    });
    const navigate = useNavigate();


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = routes.filter((route) =>
            route.route_long_name.toLowerCase().includes(term)
        );
        setFilteredRoutes(filtered);
        console.log("Filtered Routes:", filtered); 
        setShowResults(true);
    };

    const handleClickOutside = (e) => { // Cand dam clikc pe afara sa se inchida lista de rezultate
        if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
            setShowResults(false);
        }
    };

    useEffect(() => { //Obtinem vehiculele pentru rute
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://api.tranzy.ai/v1/opendata/vehicles", {
                    method: "GET",
                    headers: {
                        Accept : 'application/json',
                        "X-API-KEY": "zWcIwy0GwOJVTHfBNNo23oZedgU5fG14drJE0cPp",
                        "X-Agency-Id": "1",
                    },                              
                });
                const data = await response.json();
                setVehicles(data);
                console.log("Vehicles:", data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => { //Pentru a inchide lista de rezultate cand se da click in afara
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => { //Salvam ultima ruta selectata in local storage
        const lastSelectedRouteName1 = localStorage.getItem("lastSelectedRouteName");
        const lastSelectedRouteId1 = localStorage.getItem("lastSelectedRouteId");
        const lastSelectedRouteId1Int = parseInt(lastSelectedRouteId1, 10);
        console.log("Restoring from localStorage:", {
            lastSelectedRouteName1,
            lastSelectedRouteId1Int,
        });
        if (lastSelectedRouteName1 && lastSelectedRouteId1Int)
        {
            handleRouteClick(lastSelectedRouteId1Int);
            setSearchTerm(lastSelectedRouteName1);
        }
        
    }, []);
    
    

    const handleRouteClick = async (routeID) => {
        if (!routeID) {
            console.warn("Invalid route ID:", routeID);
            return;
        }
        setSelectedRouteId(routeID);

        const route1 = routes.find((route) => route.route_id === routeID);
        setLastSelectedRouteName(selectedRouteName);
        setSelectedRouteName(route1.route_long_name);
        setSearchTerm(route1.route_long_name);
        localStorage.setItem("lastSelectedRouteName", route1.route_long_name);
        localStorage.setItem("lastSelectedRouteId", routeID);

        if(route1.eco_friendly)
        {
            const token = localStorage.getItem("access_token");
            try {
                const response = await axios.post(
                    "https://fiicode-urbanisation.onrender.com/api/user/add_points/",
                    { points: 10 }, // Trimite punctele către backend
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    toast.success("Points added successfully!");
                    fetchUserPoints();
                }

            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    let newtoken = await refreshAccessToken();
                    if (newtoken) {
                        try {
                            const retryresponse = await axios.post(
                                "https://fiicode-urbanisation.onrender.com/api/user/add_points/",
                                { points: 10 }, // Trimite punctele către backend
                                {
                                    headers: {
                                        Authorization: `Bearer ${newtoken}`,
                                    },
                                }
                            );
                            if (retryresponse.status === 200) {
                                fetchUserPoints();
                                toast.success("Points added successfully!");
                            }
                        } catch (error) {
                            console.error("Error adding points:", error);
                        }
                    }
                    else {
                        navigate("/login");
                    }
            }
        }
    }
        const trip = trips.find((trip) => trip.route_id === routeID && trip.direction_id === 0);
        let stopSeq = 0;
        let stopIDs = [];
        let stopid = stop_times.find((stop) => stop.trip_id === trip.trip_id && stop.stop_sequence === stopSeq);
        stopIDs.push(stopid.stop_id);
        stopSeq++;
        while (stopid) {
            stopid = stop_times.find((stop) => stop.trip_id === trip.trip_id && stop.stop_sequence === stopSeq);
            if (stopid) {
                stopIDs.push(stopid.stop_id);
                stopSeq++;
            }
        }
        let stops_details = [];
        setShowPolyline(false);
        for (let i = 0; i < stopIDs.length; i++) {
            const stop = stops.find((stop) => stop.stop_id === stopIDs[i]);
            stops_details.push({
                stop_name: stop.stop_name,
                lat: stop.stop_lat,
                lon: stop.stop_lon,
            });
        }
        setColor(route1.route_color);
        setTimeout(() => setShowPolyline(true), 10);
        setStopsDetails(stops_details);
        
        console.log("Route clicked:", route1.route_long_name);
        console.log("Trip:", trip);
        console.log("Stops", stops_details);
        console.log("Color", color);
        console.log( "Transmit: ",stopsDetails.map((stop) => [stop.lat, stop.lon]))
        setShowResults(false);
    }
    const addRouteToFavorites = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found in local storage.");
            return;
        }
        if (!selectedRouteId || !selectedRouteName) {
            console.error("Route ID or name is missing.");
            return;
        }
        setRouteFavorite({
            route_id: selectedRouteId,
            route_name: selectedRouteName,
            token: token,
        });
        try {
            const response = await axios.post("https://fiicode-urbanisation.onrender.com/api/routes/add-favorite/", {
                route_id: selectedRouteId,
                route_name: selectedRouteName,
                token: token,
            });
            if (response.status === 201) {
                toast.success("Route added to favorites!");
                console.log("Route added to favorites:", response.data);
            }
            else {
                toast.error("Failed to add route to favorites.");
                console.log("Failed to add route to favorites:", response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 408) {
                toast.error("Route already exists in favorites.");
                console.log("Route already exists in favorites:", error.response.data);
            }
            else{
                toast.error("Error adding route to favorites.");
                console.error("Error adding route to favorites:", error);
            }
        }

    };

    

    return (
        <>
            <div className="search-bar-container" ref={searchBarRef}>
                <input
                    type="text"
                    placeholder="Search for routes..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => setShowResults(true)}
                    className="search-bar"
                />
                {showResults  && (
                    <div className="search-results">
                    <ul>
                        {filteredRoutes.map((route, index) => (
                            <li
                                key={index}
                                className={`search-result-item ${route.eco_friendly ? "eco-friendly" : ""}`}
                                onClick={() => handleRouteClick(route.route_id)}
                            >
                                <span
                                    className="route-number"
                                    style={{ backgroundColor: route.route_color }}
                                >
                                    {route.route_id}
                                </span>
                                <span className="route-name">
                                    {route.route_long_name}
                                    {route.eco_friendly && (
                                        <span className="eco-friendly-indicator">🌱</span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                )}
            </div>
            <div className="route-info">
                <div className="routes-searched">
                    <h3>Selected Route: <strong>{selectedRouteName || "None"}</strong></h3>
                    <h4>Last Selected Route: {lastSelectedRouteName || "None"}</h4>
                </div>
                <button onClick={addRouteToFavorites}>Add selected route to favorites</button>
            </div>
            <div style={{ height: "50vh", width: "50vw" }} className="map-container">
                <MapContainer
                    center={[47.1585, 27.6014]}
                    zoom={13}
                    whenCreated={(mapInstance) => {
                        mapRef.current = mapInstance;

                    }}
                    style={{ height: "50vh", width: "50vw" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {stopsDetails.map((stop, index) => {
                       if (!stop.lat || !stop.lon) {
                        console.warn(`Stop ${stop.stop_name} has invalid coordinates.`);
                        return null; // Ignoră stopurile fără coordonate valide
                    }
                        const isFirst = index === 0;
                        const isLast = index === stopsDetails.length - 1;

                        return (
                            <Marker
                                key={index}
                                position={[stop.lat, stop.lon]}
                                icon={L.icon({
                                    iconUrl: isFirst
                                        ? "/media/test.png" 
                                        : isLast
                                        ? "/media/test.png" 
                                        : "/media/default.png", 
                                    iconSize: isFirst || isLast ? [32, 32] : [16, 16], 
                                    iconAnchor: isFirst || isLast ? [16, 32] : [8, 16],
                                })}
                            >
                                <Popup>{stop.stop_name}</Popup>
                            </Marker>

                        );
                    })}
                    {selectedRouteId && vehicles
                        .filter((vehicle) => vehicle.route_id === selectedRouteId && vehicle.trip_id!=null) // Filtrează vehiculele
                        .map((vehicle, index) => {
                            if (!vehicle.latitude || !vehicle.longitude) {
                                console.warn(`Vehicle ${vehicle.id} has invalid coordinates.`);
                                return null; // Ignoră vehiculele fără coordonate valide
                            }
                            const vehiclePosition = [vehicle.latitude, vehicle.longitude];
                            const tripHeadsign = trips.find((trip) => trip.trip_id === vehicle.trip_id)?.trip_headsign || "Unknown";
                            return (
                                <Marker
                                    key={index}
                                    position={vehiclePosition}
                                    icon={L.icon({
                                        iconUrl: "/media/bus2.png",
                                        iconSize: [32, 32],
                                        iconAnchor: [16, 32],
                                    })}
                                >   
                                    <Popup>Speed: {vehicle.speed} km/h<br />Id: {vehicle.id}<br />Catre: <strong>{tripHeadsign}</strong></Popup>
                                </Marker>
                            );
                        })}
                    
                    {stopsDetails.length > 1 && showPolyline===true && (
                        <Routing points={stopsDetails} color={color || "blue"} />
                        
                    )}
                </MapContainer>
            </div>
        </>
    );
}

export default Map;