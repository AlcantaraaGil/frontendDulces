import React, { useEffect, useState } from 'react';
import { Table, Button, DatePicker,Modal,Typography,Select } from 'antd';

export const VentasTotales = () => {
  const today = new Date(); // Obtener la fecha de hoy
  const todayRange = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Establecer la hora a las 00:00:00 del día de hoy
  const [data, setData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([todayRange, todayRange]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSelected, setDataSelected] = useState([]);
  const [estatusSelected, setEstatusSelected] = useState(null); // Nuevo estado para el estatus seleccionado

  const showModal = (record) => {
    
    setIsModalOpen(true);
    setDataSelected(record);
    setEstatusSelected(record.estatus); // Establecer el estatus seleccionado al abrir el modal
  };

  const handleOk = async () => { // Make handleOk asynchronous
    if (estatusSelected !== dataSelected.estatus) { // Check for status change
      try {
        const response = await fetch(`/sales/${dataSelected._id}`, { // Update API endpoint with ID
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estatus: estatusSelected }),
        });

        if (!response.ok) {
          throw new Error('Error updating sale status');
        }

        const updatedData = await response.json();

        const updatedSales = data.map((sale) =>
          sale._id === updatedData._id ? updatedData : sale
        );

        setData(updatedSales);
      } catch (error) {
        console.error('Error updating sale status:', error);
      } finally {
        setIsModalOpen(false);
      }
    } else {
      console.log('Sale status remains unchanged.');
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch('/salescompleted')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
          const formattedSales = data.map((item, index) => {
            const fecha = new Date(item.date);
            const month = fecha.toLocaleString('en', { month: 'short' });
            const day = fecha.getDate();
            const year = fecha.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;

            return {
              key: index,
              cliente: item.client,
              fecha: formattedDate,
              total: item.totalAmount,
              estatus: item.paymentMethod,
              _id: item._id,
              productsSold: item.productsSold,
            };
          });

          const filteredData = formattedSales.filter((record) =>
            applyCustomDateRangeFilter(record)
          );
          setFilteredInfo({ dateRange: selectedDateRange }); // Update filteredInfo
          setData(filteredData); // Update data source directly
        } else {
          console.error('La respuesta de la API no es un array:', data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, [data, selectedDateRange]);

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      sorter: (a, b) => {
        if (a.cliente < b.cliente) return -1;
        if (a.cliente > b.cliente) return 1;
        return 0;
      }
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      onFilter: (value, record) => {
        if (value === null) {
          return true; // Show all rows if no filter is selected
        } else if (value === 'custom') {
          return applyCustomDateRangeFilter(record);
        } else {
          return record.fecha.includes(value); // Filter by exact date match
        }
      },
      sorter: (a, b) => {
        if (a.fecha < b.fecha) return -1;
        if (a.fecha > b.fecha) return 1;
        return 0;
      },
      render: (text) => <>{text}</>, // Display formatted date
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus',
      key: 'estatus',
      filters: [
        { text: 'Pagado', value: 'Pagado' },
        { text: 'Fiado', value: 'Fiado' },
      ],
      onFilter: (value, record) => record.estatus === value,
      render: (text) => (text === 'Fiado' ? <b>{text}</b> : text)
    },
    {
      title: 'Accion',
      dataIndex: 'accion',
      key: 'accion',
      render: (text, record) => (
        <Button type="primary" onClick={() => { showModal(record) }}>Ver</Button>
      )
    },
  ];

  function applyCustomDateRangeFilter(record) {
    const { dateRange } = filteredInfo;
    const [startDate, endDate] = dateRange || [];

    if (startDate && endDate) {
      const recordDate = new Date(record.fecha);
      return recordDate >= startDate && recordDate <= endDate;
    }

    return true; // Show all rows if no date range is selected
  }
  return (
    <div>
      <div className="date-picker-container">
        <DatePicker
          placeholder="Fecha de inicio"
          onChange={(date) => setSelectedDateRange([date, selectedDateRange[1]])}
        />
        <DatePicker
          placeholder="Fecha de fin"
          onChange={(date) => setSelectedDateRange([selectedDateRange[0], date])}
        />
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={data} // Use data directly for filtering
          filteredInfo={filteredInfo}
          onFilterChange={(newFilteredInfo) => setFilteredInfo(newFilteredInfo)}
        />
      </div>
      
      <Modal
        title={dataSelected.cliente}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography.Text strong>Fecha: </Typography.Text>
        {dataSelected.fecha}
        <br />
        <Typography.Text strong>Total: </Typography.Text>${dataSelected.total}
        <br />
        <Typography.Text strong>Estatus: </Typography.Text>
        <Select
          value={estatusSelected}
          onChange={(value) => setEstatusSelected(value)}
        >
          <Select.Option value="Pagado">Pagado</Select.Option>
          <Select.Option value="Fiado">Fiado</Select.Option>
        </Select>
        <br />
        <Typography.Text strong>Productos vendidos: </Typography.Text>
        <ul>
          {dataSelected.productsSold &&
            dataSelected.productsSold.map((product, index) => (
              <li key={index}>
                {product.quantity} x {product.name}
              </li>
            ))}
        </ul>
      </Modal>


    </div>
  )
}
