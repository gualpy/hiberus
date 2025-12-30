import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Catalogo from './js/components/Catalogo.js';

const App = () => {
    const [carrito, setCarrito] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 1. Lógica para añadir al carrito (desde el componente Catalogo)
    const agregarAlCarrito = (producto) => {
        setCarrito(prev => [...prev, { ...producto, quantity: 1 }]);
    };

    // 2. UC-O03: Lógica para simular el Pago (Checkout)
    const procederAlPago = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/checkout`, {
                method: 'POST'
            });
            const data = await response.json();

            if (response.ok) {
                alert("¡Pago exitoso! Estado del pedido: PAID");
            } else {
                alert("Error en el pago: " + data.error);
            }
        } catch (error) {
            console.error("Error en checkout:", error);
        }
    };

    // 3. UC-O01: Lógica para enviar el pedido al Backend
    const finalizarPedido = async () => {
        if (carrito.length === 0) return;

        setCargando(true);
        const payload = {
            userId: 2, // ID del cliente creado en Fixtures
            items: carrito.map(i => ({
                productId: i.id,
                quantity: i.quantity
            }))
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`¡Pedido #${data.orderId} creado con éxito!`);
                setCarrito([]); // Limpiar carrito

                // Preguntar si desea pagar de una vez
                if (window.confirm("¿Deseas procesar el pago (Checkout) ahora?")) {
                    await procederAlPago(data.orderId);
                }
            } else {
                alert("Error: " + (data.error || "No se pudo crear el pedido"));
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    return React.createElement('div', { style: { fontFamily: 'Arial', padding: '20px' } },
        React.createElement('h1', null, 'Tienda Hiberus'),

        // Bloque del Carrito
        React.createElement('div', {
            style: { background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }
        },
            React.createElement('h2', null, 'Mi Carrito'),
            React.createElement('p', null, `Productos en carrito: ${carrito.length}`),

            // El botón solo aparece si hay productos y no estamos procesando
            carrito.length > 0 && React.createElement('button', {
                onClick: finalizarPedido,
                disabled: cargando,
                style: {
                    background: '#28a745',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: cargando ? 'not-allowed' : 'pointer'
                }
            }, cargando ? 'Procesando...' : 'FINALIZAR PEDIDO Y PAGAR')
        ),

        // Componente del Catálogo
        React.createElement(Catalogo, { alAgregarAlCarrito: agregarAlCarrito })
    );
};

// Renderizado en el div #root de Twig
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
}