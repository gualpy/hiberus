import { useEffect, useState } from 'react';

const Catalogo = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Tu API de Symfony en el puerto 8080
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
            .then(data => alert(`Pedido creado: ID ${data.orderId}`));
    };

    return (
        <div>
            <h1>Tienda Hiberus</h1>
            {products.map(p => (
                <div key={p.id}>
                    <h3>{p.name} - {p.price}€</h3>
                    <button onClick={() => handleBuy(p.id)}>Comprar</button>
                </div>
            ))}
        </div>
    );
};

export default Catalogo;