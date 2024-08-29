import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';

export const ReporteCliente = () => {
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
    },
    {
      title: 'Pagado',
      dataIndex: 'pagado',
      key: 'pagado',
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.pagado - b.pagado,
    },
    {
      title: 'Fiado',
      dataIndex: 'fiado',
      key: 'fiado',
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.fiado - b.fiado,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
      sorter: (a, b) => a.total - b.total,
    },
  ];

  useEffect(() => {
    fetch("/salescompleted")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const groupedByClient = data.reduce((acc, venta) => {
            const cliente = venta.client;
            if (!acc[cliente]) {
              acc[cliente] = {
                cliente,
                pagado: 0,
                fiado: 0,
                total: 0,
              };
            }

            if (venta.paymentMethod === "Pagado") {
              acc[cliente].pagado += venta.totalAmount;
            } else {
              acc[cliente].fiado += venta.totalAmount;
            }

            acc[cliente].total += venta.totalAmount;

            return acc;
          }, {});

          const sortedData = Object.values(groupedByClient).sort((a, b) => {
            // Ordenar por cliente en orden alfabético
            return a.cliente.localeCompare(b.cliente);
          });

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
