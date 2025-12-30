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
        // Aseguramos que el precio sea un número para evitar errores en el total
        const precioNumerico = parseFloat(producto.price) || 0;
        setCarrito(prev => [...prev, { ...producto, cod_product: producto.cod_product, price: precioNumerico, quantity: 1 }]);
    };

    const crearProducto = async () => {
        const cod_product = prompt("Código del producto");
        const name = prompt("Nombre del producto:");
        const price = prompt("Precio (ej: 10.50):");
        const stock = prompt("Stock inicial:");

        if (!name || !price) return;

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cod_product,
                    name,
                    price: parseFloat(price),
                    stock: parseInt(stock) || 0
                })
            });

            if (response.ok) {
                alert(" Producto creado correctamente.");
            } else {
                const errorData = await response.json();
                alert(" Error: " + errorData.error);
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
        }
    };

    const finalizarPedido = async () => {
        if (carrito.length === 0) return;
        console.log(carrito);
        setCargando(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code_user: user.user_code,
                    userId: user.id,
                    items: carrito.map(i => ({ code_user: i.code_user, productId: i.id, quantity: i.quantity }))
                })
            });
            console.log(response);
            const data = await response.json();
            
            if (response.ok) {
                alert(`¡Pedido #${data.orderId} creado!`);
                setCarrito([]);

                if (window.confirm("¿Deseas pagar este pedido ahora?")) {
                    const pagoRes = await fetch(`/api/orders/${data.orderId}/checkout`, { method: 'POST' });
                    if (pagoRes.ok) alert("Pago procesado con éxito.");
                }
            }
        } catch (e) { 
            alert("Error al procesar el pedido"); 
        } finally { 
            setCargando(false); 
        }
    };

    // Calcular el total de forma segura
    const totalPagar = carrito.reduce((acc, item) => acc + (item.price || 0), 0);

    if (!user) {
        return React.createElement(Login, { onLogin: setUser });
    }

    return React.createElement('div', { className: 'app-wrapper' },
        // HEADER
        React.createElement('header', { className: 'app-header' },
            React.createElement('div', { className: 'user-tag' },
                React.createElement('span', null, `👤 ${user.name}`),
                React.createElement('span', { className: 'role-pill' }, user.role)
            ),
            React.createElement('button', { className: 'logout-link', onClick: handleLogout }, 'Salir')
        ),

        React.createElement('div', { className: 'view-container' },
            user.role === 'ROLE_ADMIN' ? (
                // VISTA ADMIN
                React.createElement('div', { className: 'admin-card' },
                    React.createElement('h2', null, 'Panel de Administración'),
                    React.createElement('button', {
                        className: 'btn-checkout',
                        style: { background: '#1e293b', marginTop: '20px' },
                        onClick: crearProducto
                    }, '+ Nuevo Producto Real')
                )
            ) : (
                // VISTA CLIENTE
                React.createElement(React.Fragment, null,
                    React.createElement('div', { className: 'cart-summary' },
                        React.createElement('h2', null, '🛒 Mi Carrito'),
                        
                        // Lista de productos
                        carrito.length > 0 ? (
                            React.createElement('div', null,
                                carrito.map((item, idx) => 
                                    React.createElement('div', { key: idx, className: 'cart-item-row', style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' } },
                                        React.createElement('span', null, item.name),
                                        React.createElement('span', null, `$${(item.price || 0).toFixed(2)}`)
                                    )
                                ),
                                React.createElement('div', { style: { marginTop: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2em', color: '#22c55e' } },
                                    `Total: $${totalPagar.toFixed(2)}`
                                )
                            )
                        ) : (
                            React.createElement('p', null, 'El carrito está vacío')
                        ),

                        carrito.length > 0 && React.createElement('button', {
                            className: 'btn-checkout',
                            style: { marginTop: '20px' },
                            onClick: finalizarPedido,
                            disabled: cargando
                        }, cargando ? 'Enviando...' : 'PAGAR AHORA')
                    ),
                    React.createElement(Catalogo, { alAgregarAlCarrito: agregarAlCarrito })
                )
            )
        )
    );
};

const root = document.getElementById('root');
if (root) ReactDOM.createRoot(root).render(React.createElement(App));