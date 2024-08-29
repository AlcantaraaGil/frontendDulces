import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';

export const ReporteProducto = () => {
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'Producto',
      dataIndex: 'producto',
      key: 'producto',
    },
    {
      title: 'Vendido',
      dataIndex: 'vendido',
      key: 'vendido',
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.vendido - b.vendido,
    }
  ];

  useEffect(() => {
    fetch("/salescompleted")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const productsSold = data.flatMap(venta => venta.productsSold); // Obtener todos los productos vendidos de todas las ventas
          const productQuantities = productsSold.reduce((acc, product) => {
            const { name, quantity } = product;
            acc[name] = (acc[name] || 0) + quantity; // Sumar la cantidad vendida para cada producto
            return acc;
          }, {});

          const sortedData = Object.entries(productQuantities).map(([producto, vendido]) => ({
            producto,
            vendido
          })).sort((a, b) => a.vendido - b.vendido);

          setData(sortedData);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, []);

  return (
    <div className='reports-table-container'>
      <div className="table-container">
        <Table dataSource={data} columns={columns} />
      </div>
    </div>
  );
};
