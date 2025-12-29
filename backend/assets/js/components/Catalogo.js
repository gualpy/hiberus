import React, { useEffect } from 'react';

const Catalogo = () => {
    useEffect(() => {
        console.log("¡Éxito! Hello desde React");
    }, []);

    // JS PURO para que el navegador no se rompa
    return React.createElement('div', null, 
        React.createElement('h1', null, 'Hola desde React - Tienda Hiberus')
    );
};

export default Catalogo;