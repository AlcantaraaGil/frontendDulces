import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Typography, message } from 'antd';

export const Clientes = () => {
  const [data, setData] = useState([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [inputValues, setInputValues] = useState({
    name: ''
  });
  const [salesData, setSalesData] = useState([]);
  const [totalFiado, setTotalFiado] = useState(0);

  useEffect(() => {
    fetch("/clients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("API response is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedClientIndex !== null) {
      fetch("/salescompleted")
        .then((res) => res.json())
        .then((salesData) => {
          setSalesData(salesData);
        })
        .catch((error) => {
          console.error("Error fetching sales data from API:", error);
        });
    }
  }, [selectedClientIndex]);

  const handleEditarCliente = (index) => {
    setSelectedClientIndex(index);
    const client = data[index];
    setInputValues({
      name: client.name
    });
  };

  const handleOk = async () => {
    try {
      const updatedClient = {
        _id: '6438161cd2b13ddb37e6e7e4', // Cambiar con el _id del cliente
        ...data[selectedClientIndex],
        ...inputValues
      };

      const response = await fetch(`/clients/${updatedClient._id}`, { // Pasar el _id en la URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedClient)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el cliente'); // Or a more specific error message based on the response
      }

      const updatedData = [...data];
      updatedData[selectedClientIndex] = updatedClient;
      setData(updatedData);
      setSelectedClientIndex(null);
      setInputValues({
        name: ''
      });
      message.success('El cliente ha sido editado con éxito');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setSelectedClientIndex(null);
    setInputValues({
      name: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  useEffect(() => {
    if (selectedClientIndex !== null && salesData.length > 0) {
      const clientName = data[selectedClientIndex].name;
      const clientSales = salesData.filter(sale => sale.client === clientName);
      const fiadoSales = clientSales.filter(sale => sale.paymentMethod === 'Fiado');
      const totalFiadoAmount = fiadoSales.reduce((acc, sale) => acc + sale.totalAmount, 0);
      setTotalFiado(totalFiadoAmount);
    }
  }, [selectedClientIndex, salesData, data]);


  const handlePagarCuenta = async () => {
    try {
      const clientId = data[selectedClientIndex]._id;
      const response = await fetch(`/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paidAllDebts: true }) // Indicar al servidor que se han pagado todas las deudas
      });

      if (!response.ok) {
        throw new Error('Error al pagar la cuenta');
      }

      message.success('Cuenta pagada exitosamente');
      setSelectedClientIndex(null);
      // Actualizar otras partes de tu estado según sea necesario
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="clientes-container">
      <Card
        style={{ width: 300, marginBottom: 16, marginRight: 40 }}
      >
        <Card.Meta title="Agregar cliente" />
        <div className="card-buttons">
          <Button type="primary">Agregar</Button>
        </div>
      </Card>
      {data.map((client, index) => (
        <Card
          key={index}
          style={{ width: 300, marginBottom: 16, marginRight: 40 }}
        >
          <Card.Meta title={client.name} />
          <div className="card-buttons">
            <Button onClick={() => handleEditarCliente(index)} type="primary">
              Ver
            </Button>
            <Button type="primary" danger>
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
      <Modal
        title="Editando cliente"
        visible={selectedClientIndex !== null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedClientIndex !== null && (
          <>
            <Typography.Title level={3}>{data[selectedClientIndex].name}</Typography.Title>
            <Typography.Text strong>Nombre:</Typography.Text>
            <Input
              name="name"
              placeholder={data[selectedClientIndex].name}
              value={inputValues.name}
              onChange={handleInputChange}
            />
            <br/>
            <br/>
            <Typography.Text strong>Deuda total: </Typography.Text>
            <Typography.Text>{totalFiado}</Typography.Text>
            <br/>
            <br/>
            {/* <Typography.Text strong>ID del Cliente:</Typography.Text>
            <Typography.Text>{data[selectedClientIndex]._id}</Typography.Text> */}
            <Button onClick={handlePagarCuenta}>Pagar Cuenta</Button>
          </>
        )}
      </Modal>
    </div>
  );
};
