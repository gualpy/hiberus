import React, { useEffect, useState } from 'react';

const Catalogo = ({ alAgregarAlCarrito }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Consumimos la API real que poblamos con las Fixtures
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error:", err));
    }, []);

    return React.createElement('div', null,
        React.createElement('h2', null, 'Catálogo de Productos'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap' } },
            productos.map(p => 
                React.createElement('div', { 
                    key: p.id, 
                    style: { border: '1px solid #ddd', padding: '10px', margin: '10px', borderRadius: '8px' } 
                },
                    React.createElement('h3', null, p.name),
                    React.createElement('p', null, `Precio: $${p.price}`),
                    React.createElement('p', null, `Stock: ${p.stock}`),
                    React.createElement('button', { 
                        onClick: () => alAgregarAlCarrito(p),
                        disabled: p.stock <= 0,
                        style: { cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', padding: '5px 10px' }
                    }, 'Añadir al Carrito')
                )
            )
        )
    );
};

export default Catalogo;