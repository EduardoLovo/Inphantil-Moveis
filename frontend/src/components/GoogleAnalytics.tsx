// frontend/src/components/GoogleAnalytics.tsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GoogleAnalytics = () => {
  const location = useLocation();
  // Estado que diz se os cookies já foram aceitos no localStorage
  const [cookiesAccepted, setCookiesAccepted] = useState(
    localStorage.getItem("cookies_aceitos") === "true",
  );

  // Fica "ouvindo" caso o usuário clique em "Aceitar" durante essa visita
  useEffect(() => {
    const handleCookieAccept = () => setCookiesAccepted(true);
    window.addEventListener("cookiesAccepted", handleCookieAccept);

    return () =>
      window.removeEventListener("cookiesAccepted", handleCookieAccept);
  }, []);

  // Só dispara o rastreamento se cookiesAccepted for true
  useEffect(() => {
    if (!cookiesAccepted) return; // Barra o GA de funcionar se não aceitou

    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (gaId) {
      // Verifica se já foi inicializado
      if (!(window as any).ga) {
        ReactGA.initialize(gaId);
      }

      // Envia o "pageview" para a rota atual
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
        title: document.title,
      });
    }
  }, [location, cookiesAccepted]); // Executa quando a rota muda OU quando o usuário aceita

  return null;
};

export default GoogleAnalytics;
