import { Link } from "react-router-dom";
import "../home/styles/footer.css"; // Importamos los estilos del footer

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Columna 1: Información de la marca */}
        <div className="footer-section">
          <h3>MiProyecto</h3>
          <p>
            Haciendo la web un lugar mejor, paso a paso. 
            Aquí puedes poner una breve descripción de tu aplicación.
          </p>
        </div>

        {/* Columna 2: Enlaces de navegación */}
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 3: Redes Sociales o Legal */}
        <div className="footer-section">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>

      </div>

      {/* Franja inferior con el Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MiProyecto. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};