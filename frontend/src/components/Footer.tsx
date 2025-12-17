import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa'; // Ícones de redes sociais
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content-wrapper">
                <div className="footer-section">
                    <h4 className="footer-title">Inphantil Móveis</h4>

                    <p className="footer-text">
                        Móveis montessorianos, projetados para a autonomia e
                        desenvolvimento seguro do seu filho.
                    </p>
                    <p className="footer-text">
                        &copy; {new Date().getFullYear()} Inphantil. Todos os
                        direitos reservados.
                    </p>
                </div>

                {/* Coluna 2: Navegação Rápida */}
                <div className="footer-section">
                    <h4 className="footer-title">Navegação</h4>
                    <ul className="footer-links-list">
                        <li>
                            <Link to="/">Início</Link>
                        </li>
                        <li>
                            <Link to="/products">Loja</Link>
                        </li>

                        <li>
                            <Link to="/contact">Contato</Link>
                        </li>
                        <li>
                            <Link to="/pos-venda">Informações pós venda</Link>
                        </li>
                    </ul>
                </div>

                {/* Coluna 3: Redes Sociais e Contato */}
                <div className="footer-section">
                    <h4 className="footer-title">Fale Conosco</h4>
                    <ul className="footer-links-list social-links">
                        <li>
                            <FaWhatsapp className="social-icon" />
                            <a
                                href="https://wa.me/5561982388828"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                (61) 98238-8828
                            </a>
                        </li>
                        <li>
                            <FaEnvelope className="social-icon" />
                            <a href="mailto:contato@inphantil.com.br">
                                contato@inphantil.com.br
                            </a>
                        </li>
                        <li>
                            <FaInstagram className="social-icon" />
                            <a
                                href="https://instagram.com/inphantil"
                                target="_blank"
                                rel="noopener noreferrer"
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
