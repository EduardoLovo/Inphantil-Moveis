import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#3a3a3a] text-[#cbcfd1] py-10 px-5 mt-auto shadow-[0_-2px_10px_rgba(0,0,0,0.2)] pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Coluna 1: Sobre */}
        <div className="flex-1 min-w-[250px] border-b border-dashed border-[#cbcfd1]/20 pb-6 md:border-none md:pb-0">
          <h4 className="text-[#fefe85] text-lg mb-4 border-b border-[#cbcfd1]/20 pb-2 inline-block w-full md:w-auto">
            Inphantil Móveis
          </h4>
          <p className="text-sm leading-relaxed mb-2">
            Móveis montessorianos, projetados para a autonomia e desenvolvimento
            seguro do seu filho.
          </p>
          <p className="text-sm leading-relaxed opacity-80">
            &copy; {new Date().getFullYear()} Inphantil. Todos os direitos
            reservados.
          </p>
        </div>

        {/* Coluna 2: Navegação Rápida */}
        <div className="flex-1 min-w-[250px] border-b border-dashed border-[#cbcfd1]/20 pb-6 md:border-none md:pb-0">
          <h4 className=" text-[#fefe85] text-lg mb-4 border-b border-[#cbcfd1]/20 pb-2 inline-block w-full md:w-auto">
            Navegação
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-sm hovers:text-[#fefe85] transition-colors duration-200 block"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-sm hover:text-[#fefe85] transition-colors duration-200 block"
              >
                Catálogo Completo
              </Link>
            </li>
            <li>
              <Link
                to="/apliques"
                className="text-sm hover:text-[#fefe85] transition-colors duration-200 block"
              >
                Apliques Decorativos
              </Link>
            </li>
            <li>
              <Link
                to="/calculadora-colchao"
                className="text-sm hover:text-[#fefe85] transition-colors duration-200 block"
              >
                Calculadora Sob Medida
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Redes Sociais e Contato */}
        <div className="flex-1 min-w-[250px]">
          <h4 className=" text-[#fefe85] text-lg mb-4 border-b border-[#cbcfd1]/20 pb-2 inline-block w-full md:w-auto">
            Fale Conosco
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 group">
              <FaWhatsapp className="text-lg group-hover:text-[#fefe85] transition-colors" />
              <a
                href="https://wa.me/5561982388828"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[#fefe85] transition-colors duration-200"
              >
                (61) 98238-8828
              </a>
            </li>
            <li className="flex items-center gap-3 group">
              <FaEnvelope className="text-lg group-hover:text-[#fefe85] transition-colors" />
              <a
                href="mailto:contato@inphantil.com.br"
                className="text-sm hover:text-[#fefe85] transition-colors duration-200"
              >
                contato@inphantil.com.br
              </a>
            </li>
            <li className="flex items-center gap-3 group">
              <FaInstagram className="text-lg group-hover:text-[#fefe85] transition-colors" />
              <a
                href="https://instagram.com/inphantil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[#fefe85] transition-colors duration-200"
              >
                @inphantil
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
