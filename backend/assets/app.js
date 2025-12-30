import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Catalogo from './js/components/Catalogo.js';
import Login from './js/components/Login.js';
import './styles/app.css';

const App = () => {
    const [carrito, setCarrito] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => [...prev, { ...producto, quantity: 1 }]);
    };

    // FUNCIÓN UC-P02 (CORREGIDA)
    const crearProducto = async () => {
        const name = prompt("Nombre del producto:");
        const price = prompt("Precio (ej: 10.50):");
        const stock = prompt("Stock inicial:");

        if (!name || !price) return;

        try {
            const response = await fetch('http://127.0.0.1:8080/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    stock: parseInt(stock) || 0
                })
            });

            if (response.ok) {
                alert("Producto creado correctamente en la base de datos.");
                // Opcional: podrías recargar la página o el catálogo aquí
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.error);
            }
        } catch (error) {
            console.log(error);
            alert("Error de conexión con el servidor");
        }
    };

    const finalizarPedido = async () => {
        if (carrito.length === 0) return;
        setCargando(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    items: carrito.map(i => ({ productId: i.id, quantity: i.quantity }))
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`¡Pedido #${data.orderId} creado!`);
                setCarrito([]);
            }
        } catch (e) { alert("Error de conexión"); }
        finally { setCargando(false); }
    };

    if (!user) {
        return React.createElement(Login, { onLogin: setUser });
    }

    return React.createElement('div', { className: 'app-wrapper' },
        React.createElement('header', { className: 'app-header' },
            React.createElement('div', { className: 'user-tag' },
                React.createElement('span', null, `👤 ${user.name}`),
                React.createElement('span', { className: 'role-pill' }, user.role)
            ),
            React.createElement('button', { className: 'logout-link', onClick: handleLogout }, 'Salir')
        ),

        React.createElement('div', { className: 'view-container' },
            user.role === 'ROLE_ADMIN' ? (
                React.createElement('div', { className: 'admin-card' },
                    React.createElement('h2', null, 'Panel de Administración'),
                    React.createElement('p', null, 'Gestión de productos en tiempo real'),
                    React.createElement('button', {
                        className: 'btn-checkout',
                        style: { background: '#1e293b', marginTop: '20px' },
                        onClick: crearProducto // <--- AHORA SÍ LLAMA A LA FUNCIÓN REAL
                    }, '+ Nuevo Producto Real')
                )
            ) : (
                React.createElement(React.Fragment, null,
                    React.createElement('div', { className: 'cart-summary' },
                        React.createElement('h2', null, '🛒 Carrito'),
                        React.createElement('p', null, `Items: ${carrito.length}`),
                        carrito.length > 0 && React.createElement('button', {
                            className: 'btn-checkout',
                            onClick: finalizarPedido,
                            disabled: cargando
                        }, cargando ? 'Enviando...' : 'PAGAR')
                    ),
                    React.createElement(Catalogo, { alAgregarAlCarrito: agregarAlCarrito })
                )
            )
        )
    );
};

const root = document.getElementById('root');
if (root) ReactDOM.createRoot(root).render(React.createElement(App));