import React, { useEffect, useState } from 'react';

const Catalogo = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Asegúrate de que esta URL sea la de tu API en Symfony
        fetch('http://localhost:8080/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar productos:", err);
                setLoading(false);
            });
    }, []);

    const handleBuy = (productId) => {
        fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1, // ID de prueba
                items: [{ productId: productId, quantity: 1 }]
            })
        })
        .then(res => res.json())
        .then(data => alert('¡Compra realizada! Pedido ID: ' + data.orderId))
        .catch(err => alert('Error en la compra. Revisa la consola.'));
    };

    // --- RENDERIZADO CON JS PURO (React.createElement) ---
    
    if (loading) {
        return React.createElement('div', { style: { padding: '20px' } }, 'Cargando productos...');
    }

    return React.createElement('div', { style: { padding: '20px', fontFamily: 'Arial, sans-serif' } },
        React.createElement('h1', { style: { color: '#333' } }, 'Catálogo Hiberus'),
        React.createElement('div', { style: { display: 'grid', gap: '15px' } },
            products.map(p => 
                React.createElement('div', { 
                    key: p.id, 
                    style: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px' } 
                },
                    React.createElement('h3', null, p.name),
                    React.createElement('p', null, `Precio: ${p.price}€`),
                    React.createElement('button', {
                        onClick: () => handleBuy(p.id),
                        style: {
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }
                    }, 'Comprar ahora')
                )
            )
        )
    );
};

export default Catalogo;