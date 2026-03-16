import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já tomou alguma decisão antes
    const hasResponded = localStorage.getItem("cookies_aceitos");
    if (!hasResponded) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookies_aceitos", "true");
    setIsVisible(false);
    // Dispara o evento para o Analytics começar a trabalhar
    window.dispatchEvent(new Event("cookiesAccepted"));
  };

  const handleReject = () => {
    // Salva 'false' para sabermos que ele não quer, e não ativamos o Analytics
    localStorage.setItem("cookies_aceitos", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0, // Encostado totalmente embaixo
        left: 0,
        width: "100%", // Ocupa a tela inteira na horizontal
        backgroundColor: "#ffffbc", // Sua cor principal
        color: "#333333",
        padding: "16px 5%", // Espaçamento lateral dinâmico para telas grandes
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", // Sombra projetada para cima
        zIndex: 9999,
        display: "flex",
        flexDirection: "row", // Fica tudo na mesma linha
        justifyContent: "space-between", // Texto de um lado, botões do outro
        alignItems: "center",
        flexWrap: "wrap", // Se a tela for de celular, ele quebra a linha para não amassar
        gap: "16px",
        borderTop: "1px solid #eaea9b", // Uma linha sutil separando a barra do site
      }}
    >
      {/* Área de Texto */}
      <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold",
          }}
        >
          🍪 Privacidade e Cookies
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#444444",
          }}
        >
          Nós usamos cookies para melhorar sua experiência no site da Inphantil
          Móveis e analisar nosso tráfego. Ao clicar em "Aceitar", você concorda
          com o uso de cookies analíticos.
        </p>
      </div>

      {/* Área de Botões */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleReject}
          style={{
            backgroundColor: "transparent",
            color: "#555555",
            border: "1px solid #999999",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
            e.currentTarget.style.color = "#333";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#555555";
          }}
        >
          Recusar
        </button>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: "#222222", // Fundo bem escuro
            color: "#ffffbc", // O texto com a sua cor principal!
            border: "none",
            padding: "10px 24px",
            cursor: "pointer",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "transform 0.1s, background-color 0.2s",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#000000";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#222222";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "translateY(1px)")
          }
        >
          Aceitar Todos
        </button>

        {/* Botão de Fechar "X" sutil ao lado */}
        <button
          onClick={handleReject}
          style={{
            background: "none",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            color: "#666666",
            padding: "0 0 0 8px",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Fechar"
          title="Fechar sem aceitar"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
