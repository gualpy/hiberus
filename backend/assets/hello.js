import React from 'react';
import { createRoot } from 'react-dom/client';
import Catalogo from './js/components/Catalogo.js';

const rootElement = document.getElementById('root');
if (rootElement) {
    // Usamos directamente createRoot que ya importamos arriba
    const root = createRoot(rootElement);
    root.render(React.createElement(Catalogo));
}