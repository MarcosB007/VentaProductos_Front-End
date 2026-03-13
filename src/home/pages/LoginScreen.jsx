import React, { useEffect, useState } from 'react'
import accesorios from '../../api/accesoriosApi.js'

export const LoginScreen = () => {

  const [usuarios, setUsuarios] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: ''
  });

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
