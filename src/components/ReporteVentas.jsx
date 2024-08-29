import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';

export const ReporteVentas = () => {
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Pagado',
      dataIndex: 'pagado',
      key: 'pagado',
      render: (text) => <span>$ {text}</span>, // Mostrar con dos decimales
    },
    {
      title: 'Fiado',
      dataIndex: 'fiado',
      key: 'fiado',
      render: (text) => <span>$ {text}</span>, // Mostrar con dos decimales .toFixed(2) para dos decimales
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => <Typography.Text strong>$ {text}</Typography.Text>,
    },
  ];

  useEffect(() => {
    fetch("/salescompleted")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const groupedByDate = data.reduce((acc, venta) => {
            const fechaComponents = venta.date.split(" "); // Split the timestamp into an array
            const month = fechaComponents[1]; // Get the day (Apr)
            const day = fechaComponents[2]; // Get the month (22)
            const year = fechaComponents[3]; // Get the year (2024)
            const fecha = `${day} ${month} ${year}`;
            if (!acc[fecha]) {
              acc[fecha] = {
                fecha,
                pagado: 0,
                fiado: 0,
                total: 0,
              };
            }

            if (venta.paymentMethod === "Pagado") {
              acc[fecha].pagado += venta.totalAmount;
            } else {
              acc[fecha].fiado += venta.totalAmount;
            }

            acc[fecha].total += venta.totalAmount;

            return acc;
          }, {});

          const sortedData = Object.values(groupedByDate).sort((a, b) => {
            // Ordenar por fecha en orden descendente
            return new Date(b.fecha) - new Date(a.fecha);
          });

          setData(sortedData); // Convertir el objeto en un array y ordenarlo
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });

    console.log(data);
  }, []);

  return (
    <div className='reports-table-container'>
      <div className="table-container">
        <Table dataSource={data} columns={columns} />
      </div>
    </div>
  );
};
