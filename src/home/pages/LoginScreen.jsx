import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    console.log("isAuthenticated:", isAuthenticated);
  if (isAuthenticated) {
    navigate("/home");
  }
}, [isAuthenticated]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <h2>Login</h2>

        {errors.length > 0 && (
          <div style={{ color: "red" }}>
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" style={{ width: "100%" }}>
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};
