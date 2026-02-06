import React from "react";

const RecaptchaNotice: React.FC = () => {
  return (
    <div className="text-[10px] text-gray-400 text-center mt-4 leading-tight">
      Este site é protegido pelo reCAPTCHA e aplicam-se a{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 hover:underline"
      >
        Política de Privacidade
      </a>{" "}
      e os{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 hover:underline"
      >
        Termos de Serviço
      </a>{" "}
      do Google.
    </div>
  );
};

export default RecaptchaNotice;
