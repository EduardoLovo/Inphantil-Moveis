import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importe o roteador
import App from './App.tsx';
import './index.css';
import AuthInitializer from './components/AuthInitializer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthInitializer>
                <App />
            </AuthInitializer>
        </BrowserRouter>
    </React.StrictMode>
);
