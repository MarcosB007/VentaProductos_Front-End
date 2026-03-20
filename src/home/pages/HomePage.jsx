import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import accesorios from '../../api/accesoriosApi.js'
import { useAuth } from "../../context/AuthContext.jsx";
import { Header } from "../../components/Header.jsx";
import { Footer } from "../../components/Footer.jsx";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "../styles/homepage.css";

export const HomePage = () => {

    const { isAuthenticated, logout, user } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    // ESTADO PARA FILTRAR: Guardamos el ID de la categoría elegida
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    // OBTENER CATEGORIAS
    const obtenerCategorias = async () => {
        try {
            const res = await accesorios.get("/admin/getCategorias");
            setCategorias(res.data);
        } catch (error) {
            console.log("Error al obtener las categorias: ", error);
        }
    }

    // LÓGICA DE FILTRADO (Se ejecuta en cada render automáticamente)
    const productosFiltrados = productos.filter((prod) => {
        // FILTRAR POR CATEGORIA
        const coincideCategoria = categoriaSeleccionada ? prod.id_categoria === categoriaSeleccionada : true;

        // FILTRAR POR NOMBRE
        const coincideNombre = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideNombre;
    })


    // Función para manejar el clic en los botones de filtro
    const filtrarProducto = (idCategoria) => {
        if (categoriaSeleccionada === idCategoria) {
            setCategoriaSeleccionada(null); // Si toca de nuevo la misma, quita el filtro
        } else {
            setCategoriaSeleccionada(idCategoria);
        }
    }

    const [producto, setProducto] = useState({
        nombre: "",
        descripcion: "",
        stock: 0,
        precio_lista: 0,
        url_imagen: "",
        id_categoria: ""
    });

    const [imagen, setImagen] = useState(null);

    const handleProduct = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const handleImage = (e) => {
        setImagen(e.target.files[0]);
    };

    const subirImagen = async () => {
        const data = new FormData();
        data.append("file", imagen);
        data.append("upload_preset", "react_upload");

        const res = await fetch("https://api.cloudinary.com/v1_1/diqfoqzib/image/upload", {
            method: "POST",
            body: data
        });

        const file = await res.json();

        return {
            url: file.secure_url,
            public_id: file.public_id
        };
    };

    const EliminarProducto = async (idProducto) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            await accesorios.delete(`/admin/deleteProductoById/${idProducto}`);
            // RECARGAMOS LA LISTA DESPUES DE ELIMINAR UN PRODUCTO
            obtenerProductos();
        } catch (error) {
            console.log("Error al eliminar el producto: ", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const imagenCloudinary = await subirImagen();

            const productoFinal = {
                ...producto,
                url_imagen: imagenCloudinary.url,
                public_id: imagenCloudinary.public_id
            };

            await accesorios.post("/admin/createProducto", productoFinal);
            alert("Producto creado con éxito");

            // LIMPIAMOS EL ESTADO DEL PRODUCTO
            setProducto({
                nombre: "",
                descripcion: "",
                stock: 0,
                precio_lista: 0,
                url_imagen: "",
                id_categoria: ""
            });

            // LIMPIAMOS EL ESTADO DE LA IMAGEN
            setImagen(null);

            // LIMPIAMOS LOS CAMPOS DEL FORMULARIO
            e.target.reset();

            // RECARGAMOS LA LISTA DE PRODUCTOS
            obtenerProductos();


        } catch (error) {
            console.log(error);
        }
    }

    // OBTENER PRODUCTOS
    const obtenerProductos = async () => {
        try {
            const res = await accesorios.get("/admin/productos");
            setProductos(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        obtenerProductos();
        obtenerCategorias();
    }, []);

    return (
        <>
            <Header />
            <div className="home-page-wrapper">

                <h1>HOME PAGE</h1>
                <h1>Bienvenido/a, {user?.username}</h1>

                {isAuthenticated && user.rol === "admin" && (
                    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                        <h2>Crear producto</h2>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>

                            <input type="text" name='nombre' placeholder='Nombre' onChange={handleProduct} required />
                            <textarea name='descripcion' placeholder='Descripcion' onChange={handleProduct} required />
                            <input type="number" name='stock' placeholder='Stock' onChange={handleProduct} required />
                            <input type="number" name='precio_lista' placeholder='Precio' onChange={handleProduct} required />

                            {/* SELECT DE CATEGORÍAS */}
                            <select
                                name="id_categoria"
                                onChange={handleProduct}
                                value={producto.id_categoria}
                                required
                            >
                                <option value="">-- Selecciona una categoría --</option>
                                {categorias.map((categ) => (
                                    <option key={categ.id} value={categ.id}>
                                        {categ.nombre}
                                    </option>
                                ))}
                            </select>

                            <input type="file" onChange={handleImage} required />

                            <button type='submit' className="btn btn-success">
                                Crear producto
                            </button>

                        </form>
                    </div>
                )}

                {/* BUSCADOR POR NOMBRE */}
                <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar producto por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {/* BOTONES DE FILTRO */}
                <div style={{ marginTop: "30px", marginBottom: "10px" }}>
                    <h3>Filtrar por categoría:</h3>
                    <ButtonGroup aria-label="Filtros">
                        <Button
                            variant={categoriaSeleccionada === null ? "primary" : "secondary"}
                            onClick={() => setCategoriaSeleccionada(null)}
                        >
                            Todos
                        </Button>
                        {categorias.map((categ) => (
                            <Button
                                key={categ.id}
                                onClick={() => filtrarProducto(categ.id)}
                                variant={categoriaSeleccionada === categ.id ? "primary" : "secondary"}
                            >
                                {categ.nombre}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {/* LISTADO DE PRODUCTOS FILTRADOS */}
                <div className="productos-grid">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((prod) => (
                            <Card key={prod.id} style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={prod.url_imagen} />
                                <Card.Body>
                                    <Card.Title>{prod.nombre}</Card.Title>
                                    <Card.Text>
                                        {prod.descripcion}<br />
                                        <strong>Stock:</strong> {prod.stock}<br />
                                        <strong>Precio:</strong> ${prod.precio_lista}
                                    </Card.Text>
                                    <Button variant="primary">Comprar</Button>
                                    {isAuthenticated && user.rol === "admin" && (
                                        <Button
                                            onClick={() => EliminarProducto(prod.id)}
                                            variant="danger"
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No hay productos en esta categoría.</p>
                    )}
                </div>

            </div>
            <Footer />
        </>
    )
}