import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../home/styles/header.css";

export const Header = () => {
  
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="header-container">
      <div className="header-logo">
        {/* TITULO PRINCIPAL O LOGO */}
        <Link to={isAuthenticated ? "/home" : "/"}>
          <h2>Mi Proyecto</h2>
        </Link>
      </div>

      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            {/* Opciones cuando el usuario SÍ ha iniciado sesión */}
            <span className="welcome-text">Hola, {user?.username || "Usuario"}</span>
            <Link to="/home" className="nav-link">Inicio</Link>
            <Link to="/home" className="nav-link">Perros</Link>
            <Link to="/home" className="nav-link">Facturas</Link>
            <Link to="/home" className="nav-link">Libreria</Link>
            {/* <Link to="/dashboard" className="nav-link">Dashboard</Link> */}
            
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* Opciones cuando el usuario NO ha iniciado sesión */}
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            <Link to="/register" className="nav-link nav-link-highlight">Regístrate</Link>
          </>
        )}
      </nav>
    </header>
  );
};