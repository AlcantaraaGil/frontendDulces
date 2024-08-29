import React,{useState,useEffect} from 'react'

export const Login = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, []);

  
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <p className="text-xl font-bold mb-2">Nombre: {item.name}</p>
            <p className="text-gray-600">email: {item.email}</p>
            {/* Otros campos que puedas tener en tus documentos de usuario */}
          </div>
        ))}
      </div>
        
    </div>
    
  )
}
