import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Api } from '../../Api/Api';
import { useState } from 'react';
import { useEffect } from 'react';

export const TecidosParaLencol = () => {
    const type = localStorage.getItem("user");
    const [tecidos, setTecidos] = useState([]);

    const navigate = useNavigate();

    const loadData = async () => {
        const response = await Api.buildApiGetRequest(Api.readAllTecidolUrl());
        const results = await response.json();
            
        setTecidos(results);
      };
    
    useEffect(() => {
        loadData();
    }, []);

    function compare(a, b) {
      if (a.cor < b.cor) return -1;
      if (a.cor > b.cor) return 1;
      return 0;
    }
  
    tecidos.sort(compare)

  return (
    <div className="">
      
      {type === "adm" ? 
      <div>
        <button onClick={()=>{navigate("/addtecidos")}}>Adicionar novo Tecido</button>
      </div> 
      :
       ''}

      <div>
        <h2 className='ms-5'>Junior</h2>
        <div className='d-flex flex-wrap justify-content-start'>
          {tecidos.map((tecido, index) => (
            <div className="" key={index}>
              {tecido.tamanho === 'Junior - M' ? 
              <div className="card border-dark mb-3">
                <img src={tecido.img} className="card-img-top" alt="..."/>
                <div className={tecido.quantidade <= "5" ? "card-body text-danger " : "card-body text-success"}>
                  <p>Cor: {tecido.cor}</p>
                  <p>Estoque: {tecido.estoque}</p>
                  <p className="card-text">
                    Quantidade = {tecido.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                              navigate(`/tecidos/${tecido._id}`);
                            }}
                          >
                            Editar
                    </button>
                  ): ""}
                  </p>
                  
                </div>
              </div>
              :''}
          </div>
            ))}
        </div>
      </div>

      <div >
        <h2 className='ms-5'>Solteiro</h2>
        <div className='d-flex flex-wrap justify-content-start' >
          {tecidos.map((tecido, index) => (
            <div className=""  key={index}>
              {tecido.tamanho === 'Solteiro / Solteirão - G' ? 
              <div className="card border-dark mb-3">
                <img src={tecido.img} className="card-img-top" alt="..."/>
                <div className={tecido.quantidade <= "5" ? "card-body text-danger " : "card-body text-success"}>
                  <p>Cor: {tecido.cor}</p>
                  <p>Estoque: {tecido.estoque}</p>
                  <p className="card-text">
                    Estoque: {tecido.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                              navigate(`/tecidos/${tecido._id}`);
                            }}
                          >
                            Editar
                          </button>
                  ): ""}
                  </p>
                </div>
              </div>
              :''}
        </div>
        
        ))}
        </div>
      </div>

      <div>
        <h2 className='ms-5'>Solteirão</h2>
        <div className='d-flex flex-wrap justify-content-start'>
          {tecidos.map((tecido, index) => (
            <div className="" key={index}>
              {tecido.tamanho === 'Solteiro / Solteirão - G' ? 
              <div className="card border-dark mb-3">
                <img src={tecido.img} className="card-img-top" alt="..."/>
                <div className={tecido.quantidade <= "5" ? "card-body text-danger " : "card-body text-success"}>
                  <p>Cor: {tecido.cor}</p>
                  <p>Estoque: {tecido.estoque}</p>
                  <p className="card-text">
                    Estoque = {tecido.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                              navigate(`/tecidos/${tecido._id}`);
                            }}
                          >
                            Editar
                          </button>
                  ): ""}
                  </p>
                </div>
              </div>
              :''}
        </div>
        
        ))}
        </div>
      </div>

      <div>
        <h2 className='ms-5'>Viuva</h2>
        <div className='d-flex flex-wrap justify-content-start'>
          {tecidos.map((tecido, index) => (
            <div className="" key={index}>
              {tecido.tamanho === 'Viuva - GG' ? 
              <div className="card border-dark mb-3">
                <img src={tecido.img} className="card-img-top" alt="..."/>
                <div className={tecido.quantidade < 5 ? "card-body text-danger " : "card-body text-success"}>
                  <p>Cor: {tecido.cor}</p>
                  <p>Estoque: {tecido.estoque}</p>
                  <p className="card-text">
                    Estoque = {tecido.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                              navigate(`/tecidos/${tecido._id}`);
                            }}
                          >
                            Editar
                          </button>
                  ): ""}
                  </p>
                </div>
              </div>
              :''}
        </div>
        
        ))}
        </div>
      </div>

      <div>
        <h2 className='ms-5'>Casal</h2>
        <div className='d-flex flex-wrap justify-content-start'>
          {tecidos.map((tecido, index) => (
            <div className="" key={index}>
              {tecido.tamanho === 'Casal' ? 
              <div className="card border-dark mb-3">
                <img src={tecido.img} className="card-img-top" alt="..."/>
                <div className={tecido.quantidade <= "5" ? "card-body text-danger " : "card-body text-success"}>
                  <p>Cor: {tecido.cor}</p>
                  <p>Estoque: {tecido.estoque}</p>
                  <p className="card-text">
                    Estoque = {tecido.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                              navigate(`/tecidos/${tecido._id}`);
                            }}
                          >
                            Editar
                          </button>
                  ): ""}
                  </p>
                </div>
              </div>
              :''}
        </div>
        
        ))}
        </div>
      </div>
      <div>
        <h2 className='ms-5'>BQK</h2>
        <div className='d-flex flex-wrap justify-content-start'>
          {tecidos.map((tecido, index) => (
            <div className="" key={index}>
              {tecido.tamanho === 'BQK' ? 
              <div className="card border-dark mb-3">
                <img src={tecido.img} className="card-img-top" alt="..."/>
                <div className={tecido.quantidade <= "5" ? "card-body text-danger " : "card-body text-success"}>
                  <p>Cor: {tecido.cor}</p>
                  <p>Estoque: {tecido.estoque}</p>
                  <p className="card-text">
                    Estoque = {tecido.quantidade}
                    {type === "adm" ? (
                    <button
                            type="button" 
                            className="btn btn-outline-warning "
                            onClick={() => {
                              navigate(`/tecidos/${tecido._id}`);
                            }}
                          >
                            Editar
                          </button>
                  ): ""}
                  </p>
                </div>
              </div>
              :''}
        </div>
        
        ))}
        </div>
      </div>
    </div>
  )
}

