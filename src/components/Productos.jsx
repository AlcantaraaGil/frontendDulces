import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Typography,message } from 'antd';

export const Productos = () => {
  const [data, setData] = useState([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [inputValues, setInputValues] = useState({
    name: '',
    img: '',
    price: '',
    existencia: ''
  });

  useEffect(() => {
    fetch("/products")
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

  const handleEditarProducto = (index) => {
    setSelectedProductIndex(index);
    const product = data[index];
    setInputValues({
      name: product.name,
      img: product.img,
      price: product.price.toString(),
      existencia: product.existencia.toString()
    });
  };

  const handleOk = async () => {
    try {
      
      const existencia = parseInt(inputValues.existencia);
      const price = parseInt(inputValues.price);

      const updatedProduct = {
        _id: '6438161cd2b13ddb37e6e7e4', // Cambiar con el _id del producto
        ...data[selectedProductIndex],
        ...inputValues,
        existencia: isNaN(existencia) ? 0 : existencia, // Si no es un número válido, establecer en 0
        price: isNaN(price) ? 0 : price // Si no es un número válido, establecer en 0
      };
      console.log(updatedProduct);
  
      const response = await fetch(`/products/${updatedProduct._id}`, { // Pasar el _id en la URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el producto'); // Or a more specific error message based on the response
      }
  
      const updatedData = [...data];
      updatedData[selectedProductIndex] = updatedProduct;
      setData(updatedData);
      setSelectedProductIndex(null);
      setInputValues({
        name: '',
        img: '',
        price: '',
        existencia: ''
      });
      message.success('El producto ha sido editado con exito');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  

  const handleCancel = () => {
    setSelectedProductIndex(null);
    setInputValues({
      name: '',
      img: '',
      price: '',
      existencia: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };
  return (
    <div className="products-container">
      <Card
        style={{ width: 300, marginBottom: 16 }}
        cover={<img alt="agregar" src="https://cdn-icons-png.flaticon.com/512/2182/2182944.png" />}
      >
        <Card.Meta title="Agregar producto" />
        <div className="card-buttons">
          <Button type="primary">Agregar</Button>
        </div>
      </Card>
      {data.map((item, index) => (
        <Card
          key={index}
          style={{ width: 300, marginBottom: 16 }}
          cover={<img alt={item.name} src={item.img} />}
        >
          <Card.Meta title={item.name} />
          <div className="card-buttons">
            <Button onClick={() => handleEditarProducto(index)} type="primary">
              Editar
            </Button>
            <Button type="primary" danger>
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
      <Modal
        title="Editando producto"
        visible={selectedProductIndex !== null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedProductIndex !== null && (
          <>
            <Typography.Title level={3}>{data[selectedProductIndex].name}</Typography.Title>
            <Typography.Text strong>Nombre:</Typography.Text>
            <Input 
              name="name" 
              placeholder={data[selectedProductIndex].name} 
              value={inputValues.name} 
              onChange={handleInputChange} 
            />
            <Typography.Text strong>URL de la imagen:</Typography.Text>
            <Input 
              name="img" 
              placeholder={data[selectedProductIndex].img} 
              value={inputValues.img} 
              onChange={handleInputChange} 
            />
            <Typography.Text strong>Precio:</Typography.Text>
            <Input 
              name="price" 
              placeholder={data[selectedProductIndex].price} 
              value={inputValues.price} 
              onChange={handleInputChange} 
            />
            <Typography.Text strong>Existencia:</Typography.Text>
            <Input 
              name="existencia" 
              placeholder={data[selectedProductIndex].existencia} 
              value={inputValues.existencia} 
              onChange={handleInputChange} 
            />
          </>
        )}
      </Modal>
    </div>
  );
};
