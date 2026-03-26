import { createContext, useState, useContext, useEffect } from "react";
import accesorios from '../api/accesoriosApi.js';
import { useAuth } from "./AuthContext.jsx";

const CarritoContext = createContext();

export const useCarrito = () =>  {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error("useCarrito must be used within a CarritoProvider");
    }
    return context;
}

export const CarritoProvider = ({ children }) => {
    const { user } = useAuth();
    const [carrito_id, setCarrito_id] = useState("");
    const [productosEnCarrito, setProductosEnCarrito] = useState([]);

    // FUNCION PARA OBTENER EL CARRITO DEL USUARIO (ANTES EN HomePage.jsx, AHORA EN EL CONTEXTO DEL CARRITO)
    const obtenerCarrito = async () => {
        if (!user?.id) return;
        try {
            const res = await accesorios.get(`/admin/buscarCarrito/${user.id}`);
            setCarrito_id(res.data.id);
        } catch (error) {
            console.log("Error al obtener el carrito: ", error);

        }
    };

    

    useEffect(() => {
        obtenerCarrito();
    }, [user]);

    // Exportas lo que otros componentes van a necesitar
    return (
        <CarritoContext.Provider value={{
            carrito_id,
            productosEnCarrito,
            setProductosEnCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    );
};