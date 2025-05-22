import React, { use, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
    const navigate = useNavigate();
    const [userNumber, setUserNumber] = useState(null);
  const handleAcces = () => {
        navigate('/login');
  }
  const getUserNumber = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/get_userNumber/");
        const userNumber = response.data.userNum;
        console.log("User number:", userNumber);
        setUserNumber(userNumber);
        console.log("User number state:", userNumber);
        return userNumber;
    } catch (error) {
        console.error("Error fetching user number:", error);
        return null;
    }
  }
  useEffect(() => {
    const fetchUserNumber = async () => {
        const userNumber = await getUserNumber();
        if (userNumber) {
            console.log("Fetched user number:", userNumber);
            setUserNumber(userNumber);
        }
    };
    fetchUserNumber();
  }, []);


  return (
    <div className="home-container">
      <section className="hero-section">
        <img src="/media/UrbanFlow.png" alt="UrbanFlow Logo" className="logo" />
        <h1 className="main-title">Găsește cea mai bună cale prin oraș.</h1>
        <h3 className="subtitle">Tu alegi direcția. Împreună schimbăm orașul.</h3>
        <button className="access-button" onClick={handleAcces}>Accesează site-ul</button>
      </section>

      <section className="info-section">
        <h2 className="section-title">
          Mobilitate urbană sustenabilă, gândită pentru viitor
        </h2>
        <p className="section-text">
          UrbanFlow integrează informații din transportul public
          pentru a oferi rute optimizate si eco-friendly
          în timp real. Deasemenea este integrata si comunicarea directă cu autoritățile.
        </p>
      </section>

      <section className="features-section">
        <h2 className="section-title">Ce oferim?</h2>
        <div className="features">
          {[
            "Rutare inteligentă",
            "Integrare multi-modală",
            "Comunicare bidirecțională",
            "Gamificare și recompense",
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="app-section">
        <h2 className="section-title">Pentru autorități</h2>
        <p className="section-text">
          UrbanFlow oferă un dashboard dedicat autorităților locale pentru a
          monitoriza traficul, analiza date și gestiona raportările de la
          cetățeni.
        </p>
      </section>

      <section className="impact-section">
        <h2 className="section-title">Impactul nostru</h2>
        <div className="impact-grid">
          <div>📍 1 oraș integrat</div>
          <div>🧍‍♀️ {userNumber} utilizatori activi</div>
          <div>🚍 135 rute disponibile</div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 UrbanFlow. Toate drepturile rezervate.</p>
        <p>Despre noi • Contact • Parteneriate • Termeni & condiții • Politica de confidențialitate</p>
      </footer>
    </div>
  );
};

export default Home;
