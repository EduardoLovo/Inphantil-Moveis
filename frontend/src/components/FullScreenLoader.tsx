import React from "react";
import { FaSpinner } from "react-icons/fa";

interface FullScreenLoaderProps {
  isLoading: boolean;
  title?: string;
  message?: React.ReactNode;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isLoading,
  title = "Processando...",
  message = "Por favor, aguarde um momento.",
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-[#313b2f] p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm mx-4 text-center transform transition-all animate-in zoom-in-95 duration-300 border border-[#ffd639]/20">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#ffd639] blur-xl opacity-20 rounded-full animate-pulse"></div>
          <FaSpinner className="relative animate-spin text-6xl text-[#ffd639]" />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
          {title}
        </h2>

        <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
