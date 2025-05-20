import React from "react";
import axios from "axios";

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
        console.error("No refresh token found");
        return null;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/user/token/refresh/", {
            refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
}
