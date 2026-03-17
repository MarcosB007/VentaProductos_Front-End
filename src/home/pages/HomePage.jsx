import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import accesorios from '../../api/accesoriosApi.js'

export const HomePage = () => {

    const [producto, setProducto] = useState({
        nombre: "",
        descripcion: "",
        stock: 0,
        precio_lista: 0,
        url_imagen: ""
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
        //POner alerta de confirmacion

        try {
            await accesorios.delete(`/admin/deleteProductoById/${idProducto}`);
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

            alert("producto creado");

        } catch (error) {
            console.log(error);
        }
    }

    const [productos, setProductos] = useState([]);

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
    }, []);

    return (
        <>

            <h1>HOME PAGE</h1>

            <h2>Crear producto</h2>

            <form onSubmit={handleSubmit}>

                <input type="text" name='nombre' placeholder='Nombre' onChange={handleProduct} />
                <input type="text" name='descripcion' placeholder='Descripcion' onChange={handleProduct} />
                <input type="number" name='stock' placeholder='Stock' onChange={handleProduct} />
                <input type="number" name='precio_lista' placeholder='Precio' onChange={handleProduct} />
                <input type="file" onChange={handleImage} />

                <button type='submit'>
                    Crear producto
                </button>

            </form>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>

                {productos.map((prod) => (
                    <Card key={prod.id} style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={prod.url_imagen} />
                        <Card.Body>
                            <Card.Title>{prod.nombre}</Card.Title>
                            <Card.Text>
                                {prod.descripcion}
                                <br />
                                Stock: {prod.stock}
                                <br />
                                Precio: ${prod.precio_lista}
                            </Card.Text>
                            <Button variant="primary">Comprar</Button>
                            <Button onClick={() => EliminarProducto(prod.id)} variant="danger">Eliminar producto</Button>
                        </Card.Body>
                    </Card>
                ))}

            </div>


        </>
    )
}