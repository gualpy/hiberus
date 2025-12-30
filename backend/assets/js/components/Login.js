import React, { useState } from 'react';

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

    return React.createElement('div', { className: 'login-container', style: { padding: '50px', textAlign: 'center' } },
        React.createElement('form', { onSubmit: handleSubmit, className: 'admin-card' },
            React.createElement('h2', null, 'Acceso al Sistema'),
            React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', null, 'Introduce tu código de acceso: '),
                React.createElement('br'),
                React.createElement('input', { 
                    type: 'password', 
                    value: password, 
                    onChange: (e) => setPassword(e.target.value),
                    style: { padding: '10px', fontSize: '16px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ccc' }
                })
            ),
            React.createElement('button', { 
                type: 'submit', 
                className: 'btn-checkout',
                style: { width: '200px', background: '#1e293b' }
            }, 'Entrar')
        )
    );
};

export default Login;