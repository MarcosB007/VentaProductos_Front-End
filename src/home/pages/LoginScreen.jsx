import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../styles/login.css";

export const LoginScreen = () => {
  const { signIn, errors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(form);
  };

  useEffect(() => {
    //console.log("isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className="login-page-wrapper">
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          {errors.length > 0 && (
            <div className="error-message-container">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};
