import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Catalogo from './js/components/Catalogo';
import Login from './js/components/Login';
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
        const precioNumerico = parseFloat(producto.price) || 0;
        setCarrito(prev => [
            ...prev,
            { ...producto, price: precioNumerico, quantity: 1 }
        ]);
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
                alert("Producto creado correctamente");
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.error);
            }
        } catch {
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
                // Enviamos el código del usuario que tienes en la DB (USR-001)
                user_code: user.user_code || "USR-001", 
                userId: user.id, 
                items: carrito.map(i => ({
                    id: i.id,
                    quantity: i.quantity
                }))
            })
        });

        if (response.ok) {
            const data = await response.json(); // Ahora sí extraemos el JSON
            alert(`¡Pedido #${data.orderId} creado con éxito!`);
            setCarrito([]);
            // ... resto de la lógica de pago
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.error);
        }
    } catch (e) {
        alert("Error de conexión");
    } finally {
        setCargando(false);
    }
};

    const totalPagar = carrito.reduce(
        (acc, item) => acc + (item.price || 0),
        0
    );

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <div className="user-tag">
                    <span>👤 {user.name}</span>
                    <span className="role-pill">{user.role}</span>
                </div>
                <button className="logout-link" onClick={handleLogout}>
                    Salir
                </button>
            </header>

            <div className="view-container">
                {user.role === 'ROLE_ADMIN' ? (
                    <div className="admin-card">
                        <h2>Panel de Administración</h2>
                        <button
                            className="btn-checkout"
                            style={{ background: '#1e293b', marginTop: '20px' }}
                            onClick={crearProducto}
                        >
                            + Nuevo Producto Real
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-summary">
                            <h2>🛒 Mi Carrito</h2>

                            {carrito.length > 0 ? (
                                <>
                                    {carrito.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="cart-item-row"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '8px 0',
                                                borderBottom: '1px solid #eee'
                                            }}
                                        >
                                            <span>{item.name}</span>
                                            <span>${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <div
                                        style={{
                                            marginTop: '15px',
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            fontSize: '1.2em',
                                            color: '#22c55e'
                                        }}
                                    >
                                        Total: ${totalPagar.toFixed(2)}
                                    </div>
                                </>
                            ) : (
                                <p>El carrito está vacío</p>
                            )}

                            {carrito.length > 0 && (
                                <button
                                    className="btn-checkout"
                                    style={{ marginTop: '20px' }}
                                    onClick={finalizarPedido}
                                    disabled={cargando}
                                >
                                    {cargando ? 'Enviando...' : 'PAGAR AHORA'}
                                </button>
                            )}
                        </div>

                        <Catalogo alAgregarAlCarrito={agregarAlCarrito} />
                    </>
                )}
            </div>
        </div>
    );
};

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
