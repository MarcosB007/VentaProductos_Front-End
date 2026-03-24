import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";
import { registerRequest } from "../../api/auth";
import Swal from "sweetalert2";

export const RegisterScreen = () => {
    const { signup, isAuthenticated, errors } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        username: "",
        password: "",
    });

    // Si ya está autenticado (por ejemplo, después de registrarse), ir al home
    useEffect(() => {
        if (isAuthenticated) navigate("/home");
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerRequest(formData);

            Swal.fire({
                title: "¡Registro exitoso!",
                text: "Ahora puedes iniciar sesión",
                icon: "success",
                draggable: true
            });
            
            navigate("/login");

        } catch (error) {
            console.error("Error during registration:", error);

            // Extraemos el mensaje que viene del backend
            const serverMessage = error.response?.data?.msg;

            // Configuramos la alerta según el mensaje recibido
            if (serverMessage === "El usuario ya existe") {
                Swal.fire({
                    title: "Email duplicado",
                    text: "Este correo electrónico ya está registrado. Intenta con otro o inicia sesión.",
                    icon: "warning"
                });
            } else {
                // Error genérico
                Swal.fire({
                    title: "Error",
                    text: serverMessage || "Ocurrió un error inesperado durante el registro",
                    icon: "error"
                });
            }
        }
    };

    return (
        <div className="register-page register-page-wrapper">
            <div className="register-card">
                <h2>Crear Cuenta</h2>
                <p></p>

                {errors.length > 0 && (
                    <div className="error-container">
                        {errors.map((err, i) => (
                            <p key={i}>{err}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group-row">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="btn-register">
                        Registrarse
                    </button>
                </form>

                <p className="footer-text text-black">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};