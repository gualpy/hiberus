import React from 'react';

const Login = ({ onLogin }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            id: 123,
            role: 'ROLE_CLIENT',
            name: 'Usuario Prueba'
        };
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
    };

    return React.createElement('div', { className: 'login-container' },
        React.createElement('h2', null, 'Login Simulado'),
        React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', null,
                React.createElement('label', null, 'ID Cliente: '),
                React.createElement('input', { type: 'text', defaultValue: '123' })
            ),
            React.createElement('button', { type: 'submit', style: { marginTop: '10px' } }, 'Entrar como Cliente')
        )
    );
};

export default Login;