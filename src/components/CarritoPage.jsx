import { useState, useEffect } from "react"
import accesorios from '../api/accesoriosApi.js'

export const CarritoPage = () => {

    const [isAutehnticated, user] = useAuth();
    const [productos, setProductos] = useState([])

    const getProductosCarrito = async () => {
        try {
            const [rows] = await accesorios.getProductosCarrito();

        } catch (error) {
            console.log("ERROR:", error);
        }
    }

    return (
        <div>
            <h1>Carrito Page</h1>
        </div>
    )
}