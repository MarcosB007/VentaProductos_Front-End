import { useState, useEffect } from "react"
import accesorios from '../api/accesoriosApi.js'
import { useAuth } from "../context/AuthContext.jsx";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { Button, Card } from "react-bootstrap";
import Table from 'react-bootstrap/Table';

// ... tus otras importaciones (Header, Footer, etc.)

export const CarritoPage = () => {

    const { isAuthenticated, user } = useAuth();
    const [productos, setProductos] = useState([])
    const [carrito_id, setCarrito_id] = useState("");

    //FUNCION PARA OBTENER LOS PRODUCTOS DEL CARRITO
    const obtenerProductosEnCarrito = async () => {
        try {

            const res = await accesorios.get(`/admin/getProductosCarritoCompleto/${carrito_id}`);
            setProductos(res.data);

        } catch (error) {
            console.log("Error al obtener los productos del carrito: ", error);
        }
    }

    //FUNCION PARA OBTENER EL CARRITO DEL USUARIO
    const obtenerCarrito = async () => {
        try {
            const idUsuario = user.id;
            //console.log("ID del usuario para obtener el carrito: ", idUsuario);
            const res = await accesorios.get(`/admin/buscarCarrito/${idUsuario}`);
            setCarrito_id(res.data.id);
        } catch (error) {
            console.log("Error al obtener el carrito: ", error);
        }
    }

    useEffect(() => {
        if (carrito_id) {
            obtenerProductosEnCarrito();
        }

    }, [carrito_id]);

    useEffect(() => {
        if (user?.id) {
            obtenerCarrito();
        }
    }, [user]); // Se ejecuta cuando el objeto 'user' cambia (al loguearse)


    return (
        <>
            <Header />
            <div className="home-page-wrapper">
                <div className="container mt-4 mb-5 ">
                    <h1 className="mb-4">Tu Carrito</h1>

                    {productos.length > 0 ? (
                        <>
                            <Table responsive hover className="align-middle">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((prod) => (
                                        <tr key={prod.id}>
                                            {/* COLUMNA 1: Imagen Pequeña y Nombre */}
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <img
                                                        src={prod.url_imagen}
                                                        alt={prod.nombre}
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                    />
                                                    <strong>{prod.nombre}</strong>
                                                </div>
                                            </td>

                                            {/* COLUMNA 2: Descripción breve o Stock */}
                                            <td>
                                                <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                    {prod.descripcion}
                                                </span>
                                            </td>

                                            {/* COLUMNA 3: Precio */}
                                            <td>
                                                <strong>${prod.precio_lista}</strong>
                                            </td>

                                            {/* COLUMNA 4: Botón para quitar del carrito */}
                                            <td>
                                                <Button variant="outline-danger" size="sm">
                                                    Quitar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* SECCIÓN FINAL: Total y botón de compra general */}
                            <div className="d-flex justify-content-end align-items-center mt-4 pt-3 border-top">
                                {/* Aquí iría tu lógica para sumar el total */}
                                <h4 className="me-4 mb-0">Total: $0.00</h4>
                                <Button variant="success" size="lg">
                                    Finalizar compra
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center mt-5">
                            <p className="fs-5 text-muted">No hay productos en tu carrito.</p>
                            <Button variant="primary" href="/">Volver a la tienda</Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
}