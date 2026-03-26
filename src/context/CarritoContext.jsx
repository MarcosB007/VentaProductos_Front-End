import { createContext, useState, useContext, useEffect } from "react";
import accesorios from '../api/accesoriosApi.js';
import { useAuth } from "./AuthContext.jsx";
import Swal from "sweetalert2";

const CarritoContext = createContext();

export const useCarrito = () => {
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

    const quitarDelCarrito = async (producto_id) => {

        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, quitar del carrito",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {

            if (result.isConfirmed) {
                try {

                    await accesorios.delete(`/admin/quitarDelCarrito/${carrito_id}/${producto_id}`);

                    setProductosEnCarrito((prev) => prev.filter(id => id !== producto_id));

                    Swal.fire({
                        title: "Producto quitado del carrito",
                        text: "El producto ha sido eliminado del carrito.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });

                } catch (error) {
                    console.log("Error al quitar el producto: ", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al intentar quitar el producto",
                        icon: "error"
                    });
                }
            }
        });
    };

    useEffect(() => {
        obtenerCarrito();
    }, [user]);

    // Exportas lo que otros componentes van a necesitar
    return (
        <CarritoContext.Provider value={{
            carrito_id,
            productosEnCarrito,
            setProductosEnCarrito,
            quitarDelCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    );
};