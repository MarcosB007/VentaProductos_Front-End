import React, { useEffect, useState } from 'react'
import accesorios from '../../api/accesoriosApi.js'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export const LoginScreen = () => {

  const [usuarios, setUsuarios] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: ''
  });

  const handleNuevoUsuario = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({
      ...nuevoUsuario,
      [name]: value,
    });
  };

  const handleFormulario = (e) => {
    e.preventDefault();

    createUsuario(nuevoUsuario);
  }

  const createUsuario = async () => {
    try {

      const res = await accesorios.post('/admin/createUsuario', nuevoUsuario);

    } catch (error) {

      console.log("Error al crear el usuario: ", error);

    }
  }

  const getUsuarios = async () => {

    try {
      const res = await accesorios.get('/admin/usuarios');
      const usuarios = res.data;

      setUsuarios(usuarios)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsuarios();
  }, []);


  return (
    <div>

      <Form onSubmit={handleFormulario}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            onChange={(e) => handleNuevoUsuario(e)}
            placeholder="Ingresa tu nombre"
            className="form-input"></Form.Control>
        </Form.Group>
        <Form.Group className="form-group" controlId="formApellido">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            //value={nuevoUsuario.apellido}
            onChange={(e) => handleNuevoUsuario(e)}
            placeholder="Ingresa el apellido"
            className="form-input"
          />
        </Form.Group>
        <Form.Group className="form-group" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            //value={nuevoUsuario.email}
            onChange={(e) => handleNuevoUsuario(e)}
            placeholder="Ingresa el email"
            className="form-input"
          />
        </Form.Group>
        <div className="form-button-container">
          <Button type="submit" className="submit-button">Guardar</Button>
        </div>
      </Form>

      <h1>LOGIN SCREEN</h1>

      <div style={{ padding: '2rem' }}>
        <h2>Lista de Usuarios</h2>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>

            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay usuarios disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
