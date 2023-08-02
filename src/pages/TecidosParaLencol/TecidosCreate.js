import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Api } from '../../Api/Api';

export const TecidosCreate = () => {
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const img = e.target.img.value;
      const quantidade = +e.target.quantidade.value;
      const cor = e.target.cor.value;
      const tamanho = e.target.tamanho.value;
      const estoque = e.target.estoque.value;
  
      const payload = {
        img: img,
        quantidade: quantidade,
        cor: cor,
        tamanho: tamanho,
        estoque: estoque
      };
    
      const response = await Api.buildApiPostRequest(
        Api.addTecidoUrl(),
        payload,
        true
      );
      
      if (response.status === 200) {
        // Product created successfully
        alert("Tecido adicionado com sucesso!");
        navigate("/tecidos");
      } else {
        // Error
      }
    };
    return (
      <div className="contentCreate">
        <div className="text-center m-4">
          <h1>Adicionar novo aplique</h1>
        </div>
        <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
          
          <div className="input-group mb-3 w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">Imagem</span>
            <input 
              id="img"
              name="img"
              type="text" 
              className="form-control" 
              aria-label="Sizing example input" 
              aria-describedby="inputGroup-sizing-default"/>
          </div>
  
          <div className="input-group mb-3 w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">Quantidade</span>
            <input 
            id="quantidade"
            name="quantidade"
            type="text" 
            className="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-default"/>
          </div>
  
          <label>Cor: </label>
              <div className="input-group mb-3 w-50">
                  <select id="cor" name="cor" className="form-control"  placeholder="cor">
                  <option ></option>
                  <option>Azul</option>
                  <option>Bege</option>
                  <option>Branco</option>
                  <option>Cinza</option>
                  <option>Palha</option>
                  <option>Prata</option>
                  <option>Rosa</option>
                  <option>Rosa Bebe</option>
                  </select> 
              </div>
  
              <label>Tamanho: </label>
              <div className="input-group mb-3 w-50">
                  <select id="tamanho" name="tamanho" className="form-control"  placeholder="cor">
                  <option ></option>
                  <option>Junior - M</option>
                  <option>Solteiro / Solteirão - G</option>
                  <option>Viuva - GG</option>
                  <option>Casal</option>
                  <option>BQK</option>
                  </select> 
              </div>
  
              <label>Estoque: </label>
              <div className="input-group mb-3 w-50">
                  <select id="estoque" name="estoque" className="form-control"  placeholder="estoque">
                  <option ></option>
                  <option>Sim</option>
                  <option>Nao</option>
                  </select> 
              </div>
  
          <button className="btnAtu btnBack" type="submit" >
            Adicionar
          </button>   
        </form>
      </div>
    );
}
