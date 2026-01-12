import React, { useEffect, useState } from 'react';

const Catalogo = ({ alAgregarAlCarrito }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error:", err));
    }, []);
    //console.log(productos);
    return (
        <div>
            <h2>Catálogo de Productos</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {productos.map(p => (
                    <div
                        key={p.id}
                        style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', borderRadius: '8px' }}
                    >
                        <h3>{p.name}</h3>
                        <p>Precio: ${p.price}</p>
                        <p>Stock: {p.stock}</p>
                        <button
                            onClick={() => alAgregarAlCarrito(p)}
                            disabled={p.stock <= 0}
                            style={{ cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', padding: '5px 10px' }}
                        >
                            Añadir al Carrito
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalogo;
