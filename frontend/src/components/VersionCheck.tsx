import { useEffect } from "react";

const VersionCheck = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Adiciona timestamp para evitar cache da requisição do JSON
        const response = await fetch(
          `/version.json?t=${new Date().getTime()}`,
          {
            cache: "no-store",
          },
        );
        const data = await response.json();
        const latestVersion = data.version;
        const currentVersion = localStorage.getItem("app_version");

        if (currentVersion && currentVersion !== latestVersion) {
          // Se a versão mudou, limpa cache e recarrega
          localStorage.setItem("app_version", latestVersion);

          if ("caches" in window) {
            // Limpa Cache Storage (Service Workers) se houver
            const names = await caches.keys();
            await Promise.all(names.map((name) => caches.delete(name)));
          }

          window.location.reload();
        } else if (!currentVersion) {
          localStorage.setItem("app_version", latestVersion);
        }
      } catch (error) {
        console.error("Erro ao verificar versão", error);
      }
    };

    // Verifica ao carregar e a cada 5 minutos
    checkVersion();
    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null; // Este componente não renderiza nada visualmente
};

export default VersionCheck;
