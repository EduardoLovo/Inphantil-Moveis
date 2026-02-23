import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GoogleAnalytics = () => {
  const location = useLocation();
  const isInitialized = useRef(false); // Guarda o status de inicialização

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    // 1. Inicializa apenas SE tiver o ID e SE ainda não foi inicializado
    if (gaId && !isInitialized.current) {
      ReactGA.initialize(gaId);
      isInitialized.current = true; // Marca como inicializado
    }

    // 2. Só envia o pageview se o GA estiver inicializado
    if (isInitialized.current) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
        title: document.title,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;
