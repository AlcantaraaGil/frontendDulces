import React,{useState,useEffect} from 'react'
import { Typography } from 'antd';
import { NavLink, Outlet } from 'react-router-dom'

export const Ventas = () => {
  const [nivelActivo, setNivelActivo] = useState({});
  useEffect(() => {
    setNivelActivo({ '/ventas/ventas-totales': 4 });
  }, []); 

  const handleClick = (ruta, nivel) => {
    setNivelActivo({ [ruta]: nivel });
  };

  return (
    <>
      <div className="navigation-sales-buttons">
        <Typography.Link>
          <Typography.Title level={nivelActivo['/ventas/ventas-totales'] || 5}>
            <NavLink
              to="/ventas/ventas-totales"
              onClick={() => handleClick('/ventas/ventas-totales', 4)} // Cambiar nivel a 4 al hacer clic
            >
              Detalle
            </NavLink>
          </Typography.Title>
        </Typography.Link>

        <Typography.Link>
          <Typography.Title level={nivelActivo['/ventas/ventas-reporte'] || 5}>
            <NavLink
              to="/ventas/ventas-reporte"
              onClick={() => handleClick('/ventas/ventas-reporte', 4)} // Cambiar nivel a 4 al hacer clic
            >
              Fecha
            </NavLink>
          </Typography.Title>
        </Typography.Link>

        <Typography.Link>
          <Typography.Title level={nivelActivo['/ventas/ventas-cliente'] || 5}>
            <NavLink
              to="/ventas/ventas-cliente"
              onClick={() => handleClick('/ventas/ventas-cliente', 4)} // Cambiar nivel a 4 al hacer clic
            >
              Cliente
            </NavLink>
          </Typography.Title>
        </Typography.Link>

        <Typography.Link>
          <Typography.Title level={nivelActivo['/ventas/ventas-producto'] || 5}>
            <NavLink
              to="/ventas/ventas-producto"
              onClick={() => handleClick('/ventas/ventas-producto', 4)} // Cambiar nivel a 4 al hacer clic
            >
              Producto
            </NavLink>
          </Typography.Title>
        </Typography.Link>
      </div>

      <div>
        <Outlet />
      </div>
    </>
  );
};
