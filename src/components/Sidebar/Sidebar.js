import React, { useState } from 'react';
import Logo from '../../img/LogoCir.png'
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import '../../style/style.css';
import { JwtHandler } from '../../jwt.handler/jwt_handler';

const Sidebar = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isLogged, setIsLogged] = useState(JwtHandler.isJwtValid);

  const navigate = useNavigate()

  const type = localStorage.getItem("user");

  const logout = () => {
    setIsLogged(JwtHandler.clearJwt());
    navigate("/");
    window.location.reload(false);
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className=''>
      <div className='menuMobile'>
        <div className="dropdown">
        <button className="dropbtn" onClick={handleDropdownToggle}>
          Menu
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <span ><Link to='/info'>Informações</Link></span>
            <span ><Link to='https://www.inphantil.com.br/' target='_blank'>Inphantil Site</Link></span>
            <span ><Link to='https://www.instagram.com/inphantil/' target='_blank'>Instagram</Link></span>
            <span ><Link to='https://api.whatsapp.com/send?phone=5561982388828' target='_blank'>WhatsApp</Link>  </span>
          </div>
        )}
        </div>
      </div>

      <div className='sidebar'>
        <div className="sidebar-logo">
          <img src={Logo} alt='logo inphantil'/>
        </div>
        {isLogged === false ? 
        <div className="sidebar-items">
          <Link to='/info'>Informações</Link>  
          <Link to='https://www.inphantil.com.br/' target='_blank'>Inphantil Site</Link>  
          <Link to='https://www.instagram.com/inphantil/' target='_blank'>Instagram</Link>  
          <Link to='https://api.whatsapp.com/send?phone=5561982388828' target='_blank'>WhatsApp</Link>  
        </div>
        : 
        <div className="sidebar-items">
          <Link to='/'>Home</Link>
          <Link to='/info'>Informações</Link>  
          <Link to='/catalogo-cliente'>Apliques</Link>
          <Link to='/catalogo'>Catalogo</Link>
          <Link to='/catalogo-lencol-pronta-entrega'>Catalogo Lencol Pronto Entrega</Link>
          {type === 'adm' ?  
            <div>
              <Link to='/apliques-para-comprar'>Apliques para Comprar</Link>
              <Link to='/apliques-para-cortar'>Apliques para Cortar</Link>
              <Link to='/apliques-estoque'>Apliques Estoque</Link>
              <Link to='/apliques-create'>Adicionar Aplique</Link>
            </div>: ''
          }
          <Link to='/calculadora-para-lencois'>Calculadora para Lençois</Link>
          <Link to='/calculadora-60-40'>Calculadora 60 / 40</Link>
          
        </div>
        }
      
        <div className='btnLogout'>
            {isLogged===true? 
            <button onClick={logout} className="btnPadrao ">
            Logout
          </button>: ''}
          </div>
      </div>
    </div>

  );
};

export default Sidebar;