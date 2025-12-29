import React from 'react';
import ReactDOM from 'react-dom/client';

console.log("✅ React cargado correctamente");

const App = () => {
    return React.createElement(
        'div',
        { style: { color: 'green', fontSize: '24px' } },
        'Hola desde React sin JSX'
    );
};

const root = document.getElementById('root');

if (root) {
    const rootReact = ReactDOM.createRoot(root);
    rootReact.render(React.createElement(App));
} else {
    console.error("❌ No se encontró el elemento #root");
}
