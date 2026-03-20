import { Link } from "react-router-dom";
import "../home/styles/footer.css"; 

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Nombre del proyecto en la primer columna */}
        <div className="footer-section">
          <h3>MiProyecto</h3>
          <p>
            
          </p>
        </div>

        {/* Enlaces de navegación en la segunda columna */}
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>

        {/* Redes sociales en la tercer columna */}
        <div className="footer-section">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MiProyecto. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};