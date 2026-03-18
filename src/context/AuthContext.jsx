import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    //REGISTER
    const signup = async (userData) => {
        try {

            const res = await registerRequest(userData);
            const token = res.data.token;
            setAuthToken(token);
            Cookies.set("token", token);

            setIsAuthenticated(true);
            await CheckLogin();

        } catch (error) {
            setErrors([error.response?.data?.msg || "Error en registro"]);
        }
    };

    //LOGIN
    const signin = async (userData) => {
        try {

            const res = await loginRequest(userData);

            const token = res.data.token;
            setAuthToken(token);
            Cookies.set("token", token);

            setIsAuthenticated(true);
            await CheckLogin();

        } catch (error) {
            setErrors([error.response?.data?.msg || "Error en login"]);
        }

    }

    //LOGOUT
    const logout = () => {
        Cookies.remove("token");
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const CheckLogin = async () => {
        try {

            const token = Cookies.get("token");

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            setAuthToken(token);

            const res = await verifyTokenRequest();

            setUser(res.data.user);
            setIsAuthenticated(true);

        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        CheckLogin();
    }, []);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                errors,
                loading,
                signup,
                signin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
