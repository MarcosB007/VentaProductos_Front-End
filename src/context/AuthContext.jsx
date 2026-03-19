import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, setAuthToken, verifyTokenRequest } from "../api/auth.js";
import Cookies from "js-cookie";

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
    const [loading, setLoading] = useState(true);

    //REGISTER
    const signup = async (userData) => {
        try {

            const res = await registerRequest(userData);
            const token = res.data.token;
            setAuthToken(token);
            Cookies.set("token", token);

            setIsAuthenticated(true);
            await checkLogin();

        } catch (error) {
            setErrors([error.response?.data?.msg || "Error en registro"]);
        }
    };

    //LOGIN
    const signIn = async (userData) => {
        try {
            const res = await loginRequest(userData);

            const token = res.data.token;

            setAuthToken(token);
            Cookies.set("token", token, { expires: 1 });

            setIsAuthenticated(true);
            setUser(res.data);

            //console.log("LOGIN OK");

        } catch (error) {
            console.log("ERROR:", error);
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

    const checkLogin = async () => {
        try {
            const token = Cookies.get("token");
            //console.log("TOKEN EN CHECK:", token);

            //console.log("TOKEN:", token);

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            setAuthToken(token);

            const res = await verifyTokenRequest();

            //console.log("VERIFY RESPONSE:", res.data);

            setUser(res.data);
            setIsAuthenticated(true);

        } catch (error) {
            console.log("ERROR VERIFY:", error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        checkLogin();
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
                signIn,
                logout,
                useAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
