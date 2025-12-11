import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importe o roteador
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'; //
import App from './App.tsx';
import './index.css';
import AuthInitializer from './components/AuthInitializer.tsx';

const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
            <BrowserRouter>
                <AuthInitializer>
                    <App />
                </AuthInitializer>
            </BrowserRouter>
        </GoogleReCaptchaProvider>
    </React.StrictMode>
);
