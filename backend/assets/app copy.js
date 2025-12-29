//app.js
import './bootstrap.js';
import './styles/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Catalogo from './js/components/Catalogo.js';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    // Esto es lo mismo que <React.StrictMode><Catalogo /></React.StrictMode>
    // pero en JS puro que el navegador sí entiende:
    root.render(
        React.createElement(React.StrictMode, null,
            React.createElement(Catalogo, null)
        )
    );
}