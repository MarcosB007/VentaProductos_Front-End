import React, { useState, useEffect, use } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import accesorios from '../../api/accesoriosApi.js'
import { useAuth } from "../../context/AuthContext.jsx";
import { Header } from "../../components/Header.jsx";
import { Footer } from "../../components/Footer.jsx";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "../styles/homepage.css";
import Swal from "sweetalert2";
import { useCarrito } from "../../context/CarritoContext.jsx";

export const HomePage = () => {

    const { isAuthenticated, logout, user } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const { carrito_id } = useCarrito();
    const [productosEnCarrito, setProductosEnCarrito] = useState([]);

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

    //FUNCION PARA OBTENER EL CARRITO DEL USUARIO // AGREGAR AL NUEVO CONTEXTO DEL CARRITO
    // const obtenerCarrito = async () => {
    //     try {
    //         const idUsuario = user.id;
    //         const res = await accesorios.get(`/admin/buscarCarrito/${idUsuario}`);
    //         setCarrito_id(res.data.id);
    //     } catch (error) {
    //         console.log("Error al obtener el carrito: ", error);
    //     }
    // }

    const handleCarrito = (producto_id, cantidad, precio) => {

        const nuevoProductoParaCarrito = {
            carrito_id: carrito_id,
            producto_id: producto_id,
            cantidad: cantidad,
            precio_unitario: precio
        };
        agregarAlCarrito(nuevoProductoParaCarrito);
    };

    //CAPTURAR PRODUCTO PARA AGREGARLO AL CARRITO
    const agregarAlCarrito = async (datosProducto) => {

        console.log("Datos del producto a agregar al carrito: ", datosProducto);
        if (!datosProducto.carrito_id) {
            Swal.fire({
                title: "Error",
                text: "No se pudo encontrar un carrito activo para tu usuario.",
                icon: "error"
            });
            return;
        }
        try {
            console.log("Enviando al backend: ", datosProducto);
            await accesorios.post("/admin/agregarAlCarrito", datosProducto);

            setProductosEnCarrito((prev) => [...prev, datosProducto.producto_id]);

            Swal.fire({
                title: "Producto agregado al carrito",
                icon: "success",
                timer: 1500
            });
        } catch (error) {
            console.log("Error al agregar el producto al carrito: ", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo agregar el producto",
                icon: "error"
            });
        }
    }

    // FUNCION PARA OBTENER LOS PRODUCTOS QUE YA ESTAN EN EL CARRITO 
    const obtenerProductosEnCarrito = async () => {
        try {

            const res = await accesorios.get(`/admin/getProductosCarrito/${carrito_id}`);
            const ids = res.data.map(item => item.producto_id);
            setProductosEnCarrito(ids);


        } catch (error) {
            console.log("Error al obtener los productos del carrito: ", error);
        }
    }

    // FUNCION PARA QUITAR UN PRODUCTO DEL CARRITO   // AGREGAR AL NUEVO CONTEXTO DEL CARRITO
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
        if (carrito_id) {
            obtenerProductosEnCarrito();
        }

    }, [carrito_id]);

    useEffect(() => {
        obtenerProductos();
        obtenerCategorias();
        
    }, [user]); // Se ejecuta cuando el objeto 'user' cambia (al loguearse)

    return (
        <>
            <Header />
            <div className="home-page-wrapper">

                <h1>HOME PAGE</h1>
                <h1>Bienvenido/a, {user?.username}</h1>

                {/* FORMULARIO DE CREACIÓN DE PRODUCTO */}
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

                                    {/* LOGICA PARA MOSTRAR EL BOTON DE AGREGAR AL CARRITO O QUITAR DEL CARRITO */}
                                    {productosEnCarrito.includes(prod.id) ? (
                                        <Button
                                            variant="danger"
                                            onClick={() => quitarDelCarrito(prod.id)}
                                        >
                                            Quitar del carrito
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleCarrito(prod.id, 1, prod.precio_lista)}
                                        >
                                            Agregar al carrito
                                        </Button>
                                    )}

                                    {/* BOTON PARA AGREGAR PRODUCTO AL CARRITO
                                    <Button variant="primary" onClick={() => handleCarrito(prod.id, 1, prod.precio_lista)}>
                                        Agregar al carrito
                                    </Button> */}
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