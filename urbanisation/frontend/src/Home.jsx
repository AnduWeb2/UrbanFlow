import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
  const handleAcces = () => {
        navigate('/login');
  }
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
          UrbanFlow integrează informații din transportul public, ridesharing,
          biciclete și alte opțiuni eco-friendly pentru a oferi rute optimizate
          în timp real și comunicare directă cu autoritățile.
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
          <div>🧍‍♀️ 30.000+ utilizatori activi</div>
          <div>🍃 21 tone CO₂ economisite</div>
          <div>🚲 1.500.000 km sustenabili</div>
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
