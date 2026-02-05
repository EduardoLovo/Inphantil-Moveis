import React from "react";
import { Link } from "react-router-dom";
import { FaTools, FaHardHat, FaPaintRoller, FaArrowLeft } from "react-icons/fa";

const UnderConstructionPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex pt-28 items-center justify-center bg-gray-50 relative overflow-hidden p-6">
      {/* --- ELEMENTOS DECORATIVOS DE FUNDO (Background) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FaHardHat className="absolute top-10 left-10 md:top-20 md:left-32 text-8xl text-gray-200/60 -rotate-12 animate-pulse" />
        <FaPaintRoller className="absolute bottom-10 right-10 md:bottom-20 md:right-32 text-8xl text-gray-200/60 rotate-12" />
        <FaTools className="absolute top-1/2 left-10 text-6xl text-gray-100 hidden md:block" />
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Ícone Animado Central */}
        <div className="mx-auto w-24 h-24 bg-[#313b2f] rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <FaTools className="text-4xl text-[#ffd639]" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[#313b2f] mb-4">
          Estamos em Obras!
        </h1>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Estamos preparando algo muito especial para o quarto dos pequenos.
          <br className="hidden md:block" />
          Esta página está sendo construída com muito carinho e em breve estará
          disponível.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#ffd639] text-[#313b2f] font-bold rounded-xl hover:bg-[#e6c235] hover:-translate-y-1 shadow-md hover:shadow-lg transition-all text-lg"
        >
          <FaArrowLeft /> Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
