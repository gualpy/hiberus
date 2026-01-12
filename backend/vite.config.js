import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

/* if you're using React */
// import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        /* react(), // if you're using React */
        symfonyPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.jsx"
            },
        }
    },
    server: {
        host: '0.0.0.0', // esto es correcto para Docker u otras redes
        port: 5173,
        hmr: {
            host: 'localhost', // esto arregla lo que se inyecta en el navegador
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080', // Si usas Docker, prueba 'http://php' o 'http://web'
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
