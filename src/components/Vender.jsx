import React, { useState, useEffect } from 'react';
import { Card, Button,Select,message} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;


export const Vender = () => {
  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // Estado para el cliente seleccionado
  const [cuenta, setCuenta] = useState(0);
  const [metodoPago,setMetodoPago] = useState(null);



  // Conexion a la api para consultar toda la info de los productos
  useEffect(() => {
    fetch("/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Agregar una propiedad de cantidad (quantity) a cada objeto de producto
          const productsWithData = data.map(product => ({ ...product, quantity: 0 }));
          setData(productsWithData);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/clients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, []);

  const updateCuenta = () =>{
    let total = 0;
    data.forEach(item => {
      total += item.quantity * item.price;
    });
    setCuenta(total);
  }

  const incrementQuantity = (index) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index].quantity++;
      updateCuenta();
      return newData;
    });
  };

  const decrementQuantity = (index) => {
    setData(prevData => {
      const newData = [...prevData];
      if (newData[index].quantity > 0) {
        newData[index].quantity--;
        updateCuenta();
      }
      return newData;
    });
  };

  const saleCompleted = () => {
    let foundPositiveQuantity = false;
    let productosVendidos = [];
    let fecha = new Date().toString();
  
    if (selectedClient == null || metodoPago == null) {
      //alert('Debes asignar un cliente y/o metodo de pago');
      message.warning('Debes asignar un cliente y/o metodo de pago.');
    } else {
      data.forEach(item => {
        if (item.quantity > 0) {
          productosVendidos.push({quantity:item.quantity,name:item.name})
          console.log(item.name + ' ' + item.quantity);
          foundPositiveQuantity = true;
        }
      });
      if (!foundPositiveQuantity) {
        message.warning('Debes vender al menos un item.');
      } else {
        const ventaData = {
          client: selectedClient,
          paymentMethod: metodoPago,
          totalAmount: cuenta,
          productsSold: productosVendidos,
          date: fecha
        };
      
        console.log(ventaData);
      
        fetch('/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ventaData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al enviar la venta');
          }
          return response.json();
        })
        .then(data => {
          console.log('Venta completada con éxito:', data);
          // Aquí puedes manejar cualquier acción adicional después de completar la venta
        })
        .catch(error => {
          console.error('Error al completar la venta:', error);
          // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
        });


        message.success('Venta exitosa');
        window.location.reload();

      }      
  }
};  

  return (
    <div>
      <div className='client-selector'>
        <UserOutlined style={{ fontSize: 20, marginRight: 8 }} />
        <Select
          placeholder="Selecciona un cliente"
          style={{ width: 200 }}
          onChange={value => setSelectedClient(value)}
          value={selectedClient}
        >
          {clientes.map((item, index) => (
          <Option key={index} value={item.name}>{item.name}</Option>
        ))}
        </Select>
      </div>
      <div className="products-container">
        {data.map((item, index) => (
          item.existencia>0 &&(
            <Card
              key={index}
              style={{ width: 300, marginBottom: 16 }}
              cover={<img alt={item.name} src={item.img}/>}
            >
              <Card.Meta title={item.name} />
              <div style={{ marginTop: 16 }}>
                <Button onClick={() => decrementQuantity(index)}>-</Button>
                <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                <Button onClick={() => incrementQuantity(index)}>+</Button>
              </div>
            </Card>
          )
        ))}
      </div>

      <div className='pago-container'>
        <Select 
          placeholder="Selecciona metodo pago"
          onChange={value => setMetodoPago(value)}
          style={{ width: 200 }}
        >
          <Option value="Fiado">Fiado</Option>
          <Option value="Pagado">Pagado</Option>
        </Select>
      </div>
      <div className="total-container">
          <p>
            <strong>Total: </strong>{cuenta}
          </p>
          <div className="total-button">
            <Button onClick={()=>saleCompleted()} type='primary'>Vender</Button>
          </div>
      </div>

    </div>
  );
};
