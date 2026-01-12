import React from 'react';

import { useState } from 'react';

const Login = ({ onLogin }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let user = null;
        if (password === '1234') {
            user = { id: 123, role: 'ROLE_CLIENT', name: 'Usuario Normal' };
        } else if (password === '4321') {
            user = { id: 1, role: 'ROLE_ADMIN', name: 'Administrador' };
        } else {
            alert('Código incorrecto. Usa 1234 (Cliente) o 4321 (Admin)');
            return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
    };

    return (
        <div className="login-container" style={{ padding: '50px', textAlign: 'center' }}>
            <form onSubmit={handleSubmit} className="admin-card">
                <h2>Acceso al Sistema</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label>Introduce tu código de acceso: </label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '10px',
                            fontSize: '16px',
                            marginTop: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="btn-checkout"
                    style={{ width: '200px', background: '#1e293b' }}
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;
