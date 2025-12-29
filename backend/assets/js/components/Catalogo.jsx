import React, { useEffect, useState } from 'react';

const Catalogo = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const handleBuy = (productId) => {
        fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            body: JSON.stringify({
                userId: 1,
                items: [{ productId: productId, quantity: 1 }]
            })
        })
        .then(res => res.json())
        .then(data => alert('Pedido creado: ID ' + data.orderId));
    };

    // Renderizado manual sin JSX
    return React.createElement('div', { style: { padding: '20px', fontFamily: 'sans-serif' } },
        React.createElement('h1', null, 'Tienda Hiberus'),
        products.length === 0 
            ? React.createElement('p', null, 'Cargando productos...') 
            : products.map(p => 
                React.createElement('div', { key: p.id, style: { border: '1px solid #ccc', margin: '10px 0', padding: '10px' } },
                    React.createElement('h3', null, p.name + ' - ' + p.price + '€'),
                    React.createElement('button', { 
                        onClick: () => handleBuy(p.id),
                        style: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }
                    }, 'Comprar')
                )
            )
    );
};

export default Catalogo;